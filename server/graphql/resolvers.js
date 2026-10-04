import Recipe from '../models/Recipe.js';

const resolvers = {
  // 🧭 Queries
  hello: () => '👋 Hello from the Meal Planner Server!',

  recipes: async () => {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    return recipes.map((r) => r.toJSON());
  },

  recipe: async ({ id }) => {
    const recipe = await Recipe.findById(id);
    if (!recipe) throw new Error("Recipe not found");
    return recipe.toJSON();
  },

  // 🛠️ Mutations
  addRecipe: async ({ input }) => {
    const newRecipe = new Recipe(input);
    await newRecipe.save();
    return newRecipe.toJSON();
  },

  updateRecipe: async ({ id, input }) => {
    const updated = await Recipe.findByIdAndUpdate(id, input, { new: true });
    if (!updated) throw new Error("Recipe not found");
    return updated.toJSON();
  },

  deleteRecipe: async ({ id }) => {
    const res = await Recipe.findByIdAndDelete(id);
    return !!res; // returns true if deleted
  },
};

export default resolvers;
