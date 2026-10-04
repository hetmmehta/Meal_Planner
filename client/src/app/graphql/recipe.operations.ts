import { gql } from 'apollo-angular';
import { Recipe, RecipeInput } from '../models/recipe';

const RECIPE_FIELDS = gql`
  fragment RecipeFields on Recipe {
    id
    title
    description
    category
    cookTime
    ingredients
    steps
    imageUrl
    createdAt
  }
`;

export const GET_RECIPES = gql<{ recipes: Recipe[] }, Record<string, never>>`
  query Recipes {
    recipes {
      ...RecipeFields
    }
  }
  ${RECIPE_FIELDS}
`;

export const GET_RECIPE = gql<{ recipe: Recipe | null }, { id: string }>`
  query Recipe($id: ID!) {
    recipe(id: $id) {
      ...RecipeFields
    }
  }
  ${RECIPE_FIELDS}
`;

export const ADD_RECIPE = gql<{ addRecipe: Recipe }, { input: RecipeInput }>`
  mutation AddRecipe($input: RecipeInput!) {
    addRecipe(input: $input) {
      ...RecipeFields
    }
  }
  ${RECIPE_FIELDS}
`;

export const UPDATE_RECIPE = gql<{ updateRecipe: Recipe }, { id: string; input: RecipeInput }>`
  mutation UpdateRecipe($id: ID!, $input: RecipeInput!) {
    updateRecipe(id: $id, input: $input) {
      ...RecipeFields
    }
  }
  ${RECIPE_FIELDS}
`;

export const DELETE_RECIPE = gql<{ deleteRecipe: boolean | null }, { id: string }>`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id)
  }
`;

/** Pulls a readable message out of an Apollo/GraphQL error. */
export function errorMessage(err: unknown): string {
  const apolloErr = err as {
    graphQLErrors?: ReadonlyArray<{ message: string }>;
    networkError?: unknown;
    message?: string;
  };
  if (apolloErr?.graphQLErrors?.length) return apolloErr.graphQLErrors[0].message;
  if (apolloErr?.networkError) return 'Could not reach the server. Is it running?';
  return apolloErr?.message || 'Something went wrong.';
}
