export interface Recipe {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  cookTime?: number | null;
  ingredients: string[];
  steps?: string[] | null;
  imageUrl?: string | null;
  createdAt?: string | null;
}

/** Shape of the RecipeInput type accepted by addRecipe/updateRecipe. */
export interface RecipeInput {
  title: string;
  description?: string | null;
  category?: string | null;
  cookTime?: number | null;
  ingredients: string[];
  steps?: string[];
  imageUrl?: string | null;
}
