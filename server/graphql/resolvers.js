// graphql/resolvers.js
import Recipe from '../models/Recipe.js';

const resolvers = {
  // Queries
  hello: () => '👋 Hello from the Meal Planner Server!',
  recipes: async () => {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    return recipes.map((r) => ({
      ...r._doc,
      id: r._id.toString(),
      createdAt: r.createdAt?.toISOString() || null,
    }));
  },

  // Mutations
  addRecipe: async ({ input }) => {
    const newRecipe = new Recipe(input);
    await newRecipe.save();
    return {
      ...newRecipe._doc,
      id: newRecipe._id.toString(),
      createdAt: newRecipe.createdAt?.toISOString() || null,
    };
  },

  deleteRecipe: async ({ id }) => {
    // returns true if something was deleted, else false
    const res = await Recipe.findByIdAndDelete(id);
    return !!res;
  },
};

export default resolvers;
