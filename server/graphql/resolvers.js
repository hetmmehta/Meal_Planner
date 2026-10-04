import Recipe from '../models/Recipe.js';
import { assertValidId, notFound, validateRecipeInput } from './validation.js';

const resolvers = {
  // 🧭 Queries
  Query: {
    hello: () => '👋 Hello from the Meal Planner Server!',

    recipes: async () => {
      const recipes = await Recipe.find().sort({ createdAt: -1 });
      return recipes.map((r) => r.toJSON());
    },

    recipe: async (_parent, { id }) => {
      assertValidId(id);
      const recipe = await Recipe.findById(id);
      if (!recipe) throw notFound(id);
      return recipe.toJSON();
    },
  },

  // 🛠️ Mutations
  Mutation: {
    addRecipe: async (_parent, { input }) => {
      const newRecipe = new Recipe(validateRecipeInput(input));
      await newRecipe.save();
      return newRecipe.toJSON();
    },

    updateRecipe: async (_parent, { id, input }) => {
      assertValidId(id);
      const recipe = await Recipe.findById(id);
      if (!recipe) throw notFound(id);

      // Replace the editable fields; clearing an optional field removes it.
      const data = validateRecipeInput(input);
      for (const [key, value] of Object.entries(data)) {
        recipe.set(key, value);
      }
      await recipe.save();
      return recipe.toJSON();
    },

    deleteRecipe: async (_parent, { id }) => {
      assertValidId(id);
      const res = await Recipe.findByIdAndDelete(id);
      return !!res; // false if there was nothing to delete
    },
  },
};

export default resolvers;
