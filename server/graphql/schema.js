import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Recipe {
    id: ID!
    title: String!
    ingredients: [String!]!
    instructions: String!
    createdAt: String
  }

  type Query {
    hello: String
    recipes: [Recipe!]!
  }

  input RecipeInput {
    title: String!
    ingredients: [String!]!
    instructions: String!
  }

  type Mutation {
    addRecipe(input: RecipeInput!): Recipe!
    deleteRecipe(id: ID!): Boolean
  }
`);

export default schema;
