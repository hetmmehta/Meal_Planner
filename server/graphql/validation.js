import mongoose from 'mongoose';
import { GraphQLError } from 'graphql';

export const LIMITS = {
  titleLength: 120,
  descriptionLength: 2000,
  categoryLength: 50,
  itemLength: 500,
  maxItems: 100,
  maxCookTime: 24 * 60, // minutes
  imageUrlLength: 2_000_000, // allows small base64 data URLs from the upload preview
};

export function badInput(message, field) {
  return new GraphQLError(message, {
    extensions: { code: 'BAD_USER_INPUT', field },
  });
}

export function notFound(id) {
  return new GraphQLError(`Recipe ${id} not found`, {
    extensions: { code: 'NOT_FOUND' },
  });
}

export function assertValidId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw badInput(`"${id}" is not a valid recipe id`, 'id');
  }
}

function optionalText(value, field, maxLength) {
  if (value == null) return undefined;
  const trimmed = String(value).trim();
  if (trimmed.length > maxLength) {
    throw badInput(`${field} must be at most ${maxLength} characters`, field);
  }
  return trimmed || undefined;
}

function textList(values, field) {
  const items = (values ?? []).map((v) => String(v).trim()).filter(Boolean);
  if (items.length > LIMITS.maxItems) {
    throw badInput(`${field} can have at most ${LIMITS.maxItems} entries`, field);
  }
  if (items.some((item) => item.length > LIMITS.itemLength)) {
    throw badInput(`Each entry in ${field} must be at most ${LIMITS.itemLength} characters`, field);
  }
  return items;
}

/**
 * Trims and checks a RecipeInput, returning a clean object ready to save.
 * Throws a BAD_USER_INPUT GraphQLError describing the first problem found.
 */
export function validateRecipeInput(input) {
  const title = (input.title ?? '').trim();
  if (!title) throw badInput('Title is required', 'title');
  if (title.length > LIMITS.titleLength) {
    throw badInput(`Title must be at most ${LIMITS.titleLength} characters`, 'title');
  }

  const ingredients = textList(input.ingredients, 'ingredients');
  if (ingredients.length === 0) {
    throw badInput('Add at least one ingredient', 'ingredients');
  }

  const steps = textList(input.steps, 'steps');

  let cookTime;
  if (input.cookTime != null) {
    if (!Number.isInteger(input.cookTime) || input.cookTime < 0 || input.cookTime > LIMITS.maxCookTime) {
      throw badInput(`Cook time must be between 0 and ${LIMITS.maxCookTime} minutes`, 'cookTime');
    }
    cookTime = input.cookTime;
  }

  const imageUrl = optionalText(input.imageUrl, 'imageUrl', LIMITS.imageUrlLength);
  if (imageUrl && !/^(https?:\/\/|data:image\/)/i.test(imageUrl)) {
    throw badInput('Image must be an http(s) URL or an uploaded image', 'imageUrl');
  }

  return {
    title,
    description: optionalText(input.description, 'description', LIMITS.descriptionLength),
    category: optionalText(input.category, 'category', LIMITS.categoryLength),
    cookTime,
    ingredients,
    steps,
    imageUrl,
  };
}
