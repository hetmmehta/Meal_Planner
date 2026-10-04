import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApolloServer, createApp } from '../src/app.js';
import Recipe from '../models/Recipe.js';

let mongo;
let apollo;

const RECIPE_FIELDS = 'id title description category cookTime ingredients steps imageUrl createdAt';
const ADD = `mutation ($input: RecipeInput!) { addRecipe(input: $input) { ${RECIPE_FIELDS} } }`;
const UPDATE = `mutation ($id: ID!, $input: RecipeInput!) { updateRecipe(id: $id, input: $input) { ${RECIPE_FIELDS} } }`;
const DELETE = `mutation ($id: ID!) { deleteRecipe(id: $id) }`;
const GET_ONE = `query ($id: ID!) { recipe(id: $id) { ${RECIPE_FIELDS} } }`;
const GET_ALL = `{ recipes { id title } }`;

const missingId = new mongoose.Types.ObjectId().toString();

async function run(query, variables) {
  const res = await apollo.executeOperation({ query, variables });
  assert.equal(res.body.kind, 'single');
  return res.body.singleResult;
}

function errorCode(result) {
  return result.errors?.[0]?.extensions?.code;
}

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  apollo = createApolloServer();
  await apollo.start();
});

after(async () => {
  await apollo.stop();
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await Recipe.deleteMany({});
});

test('addRecipe saves a cleaned-up recipe', async () => {
  const { data, errors } = await run(ADD, {
    input: {
      title: '  Masala Chai ',
      category: 'Breakfast',
      cookTime: 10,
      ingredients: ['Tea', 'Milk', '  '],
      steps: ['Boil water', 'Add tea and milk'],
    },
  });
  assert.equal(errors, undefined);
  assert.equal(data.addRecipe.title, 'Masala Chai');
  assert.deepEqual(data.addRecipe.ingredients, ['Tea', 'Milk']);
  assert.ok(data.addRecipe.id);
  assert.ok(data.addRecipe.createdAt);
  assert.equal(await Recipe.countDocuments(), 1);
});

test('addRecipe rejects invalid input with BAD_USER_INPUT', async () => {
  const blankTitle = await run(ADD, { input: { title: '  ', ingredients: ['Rice'] } });
  assert.equal(errorCode(blankTitle), 'BAD_USER_INPUT');

  const noIngredients = await run(ADD, { input: { title: 'Rice', ingredients: [] } });
  assert.equal(errorCode(noIngredients), 'BAD_USER_INPUT');

  const badCookTime = await run(ADD, { input: { title: 'Rice', ingredients: ['Rice'], cookTime: -1 } });
  assert.equal(errorCode(badCookTime), 'BAD_USER_INPUT');

  assert.equal(await Recipe.countDocuments(), 0);
});

test('recipes returns newest first', async () => {
  await Recipe.create({ title: 'Old', ingredients: ['a'], createdAt: new Date('2024-01-01') });
  await Recipe.create({ title: 'New', ingredients: ['b'], createdAt: new Date('2025-01-01') });
  const { data } = await run(GET_ALL);
  assert.deepEqual(data.recipes.map((r) => r.title), ['New', 'Old']);
});

test('recipe(id) returns the recipe, NOT_FOUND for unknown ids, BAD_USER_INPUT for malformed ids', async () => {
  const saved = await Recipe.create({ title: 'Dal', ingredients: ['Lentils'], steps: ['Cook'] });

  const found = await run(GET_ONE, { id: saved.id });
  assert.equal(found.data.recipe.title, 'Dal');
  assert.deepEqual(found.data.recipe.steps, ['Cook']);

  assert.equal(errorCode(await run(GET_ONE, { id: missingId })), 'NOT_FOUND');
  assert.equal(errorCode(await run(GET_ONE, { id: 'nope' })), 'BAD_USER_INPUT');
});

test('updateRecipe replaces fields and validates input', async () => {
  const saved = await Recipe.create({ title: 'Toast', ingredients: ['Bread'], description: 'Old text' });

  const { data, errors } = await run(UPDATE, {
    id: saved.id,
    input: { title: 'Cheese Toast', ingredients: ['Bread', 'Cheese'], cookTime: 5 },
  });
  assert.equal(errors, undefined);
  assert.equal(data.updateRecipe.title, 'Cheese Toast');
  assert.equal(data.updateRecipe.cookTime, 5);
  assert.equal(data.updateRecipe.description, null);

  const invalid = await run(UPDATE, { id: saved.id, input: { title: '', ingredients: ['Bread'] } });
  assert.equal(errorCode(invalid), 'BAD_USER_INPUT');

  const missing = await run(UPDATE, { id: missingId, input: { title: 'X', ingredients: ['Y'] } });
  assert.equal(errorCode(missing), 'NOT_FOUND');
});

test('deleteRecipe returns true once, then false', async () => {
  const saved = await Recipe.create({ title: 'Soup', ingredients: ['Water'] });
  assert.equal((await run(DELETE, { id: saved.id })).data.deleteRecipe, true);
  assert.equal((await run(DELETE, { id: saved.id })).data.deleteRecipe, false);
  assert.equal(errorCode(await run(DELETE, { id: 'bad' })), 'BAD_USER_INPUT');
});

test('serves GraphQL over HTTP with the configured CORS origin', async () => {
  const { app, apollo: httpApollo } = await createApp({ corsOrigins: ['http://localhost:4200'] });
  const server = app.listen(0);
  try {
    const { port } = server.address();
    const res = await fetch(`http://localhost:${port}/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:4200' },
      body: JSON.stringify({ query: '{ hello }' }),
    });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:4200');
    const body = await res.json();
    assert.match(body.data.hello, /Meal Planner/);

    const other = await fetch(`http://localhost:${port}/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://evil.example' },
      body: JSON.stringify({ query: '{ hello }' }),
    });
    assert.equal(other.headers.get('access-control-allow-origin'), null);
  } finally {
    server.close();
    await httpApollo.stop();
  }
});
