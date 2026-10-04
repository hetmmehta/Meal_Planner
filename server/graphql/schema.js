import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Recipe {
    id: ID!
    title: String!
    description: String
    category: String
    cookTime: Int
    ingredients: [String!]!
    steps: [String!]
    imageUrl: String
    createdAt: String
  }

  type Query {
    hello: String
    recipes: [Recipe!]!
    recipe(id: ID!): Recipe
  }

  input RecipeInput {
    title: String!
    description: String
    category: String
    cookTime: Int
    ingredients: [String!]!
    steps: [String!]
    imageUrl: String
  }

  type Mutation {
    addRecipe(input: RecipeInput!): Recipe!
    updateRecipe(id: ID!, input: RecipeInput!): Recipe!
    deleteRecipe(id: ID!): Boolean
  }
`);

export default schema;
