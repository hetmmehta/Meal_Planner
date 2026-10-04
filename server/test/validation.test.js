import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRecipeInput, assertValidId } from '../graphql/validation.js';

const valid = { title: '  Pancakes ', ingredients: ['Flour', ' ', 'Milk '], steps: ['Mix', ''] };

function codeOf(fn) {
  try {
    fn();
  } catch (err) {
    return [err.extensions?.code, err.extensions?.field];
  }
  return null;
}

test('trims text and drops blank list entries', () => {
  const clean = validateRecipeInput({ ...valid, description: '  ', cookTime: 15 });
  assert.equal(clean.title, 'Pancakes');
  assert.deepEqual(clean.ingredients, ['Flour', 'Milk']);
  assert.deepEqual(clean.steps, ['Mix']);
  assert.equal(clean.description, undefined);
  assert.equal(clean.cookTime, 15);
});

test('rejects a blank title', () => {
  assert.deepEqual(codeOf(() => validateRecipeInput({ ...valid, title: '   ' })), ['BAD_USER_INPUT', 'title']);
});

test('requires at least one non-empty ingredient', () => {
  assert.deepEqual(codeOf(() => validateRecipeInput({ ...valid, ingredients: ['', '  '] })), ['BAD_USER_INPUT', 'ingredients']);
});

test('rejects negative or unrealistic cook times', () => {
  assert.deepEqual(codeOf(() => validateRecipeInput({ ...valid, cookTime: -5 })), ['BAD_USER_INPUT', 'cookTime']);
  assert.deepEqual(codeOf(() => validateRecipeInput({ ...valid, cookTime: 100000 })), ['BAD_USER_INPUT', 'cookTime']);
  assert.equal(validateRecipeInput({ ...valid, cookTime: null }).cookTime, undefined);
});

test('only accepts http(s) or data:image URLs for images', () => {
  assert.deepEqual(codeOf(() => validateRecipeInput({ ...valid, imageUrl: 'javascript:alert(1)' })), ['BAD_USER_INPUT', 'imageUrl']);
  assert.equal(validateRecipeInput({ ...valid, imageUrl: 'https://example.com/a.jpg' }).imageUrl, 'https://example.com/a.jpg');
  assert.ok(validateRecipeInput({ ...valid, imageUrl: 'data:image/png;base64,AAAA' }).imageUrl);
});

test('rejects malformed ids', () => {
  assert.deepEqual(codeOf(() => assertValidId('not-an-id')), ['BAD_USER_INPUT', 'id']);
  assert.equal(codeOf(() => assertValidId('64b7f0c2a1b2c3d4e5f60718')), null);
});
