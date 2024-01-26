"use server";

import { type Ingredient, type Recipe } from "@prisma/client";
import { prisma } from "~/server/db";

export async function getRecipes() {
  return await prisma.recipe.findMany();
}

export type RecipeWithIngredients = Recipe & {
  ingredients: RecipeIngredient[];
};

export type RecipeIngredient = {
  amount: number;
  id: number;
  name: string;
  unit: string | null;
};

export async function getRecipeWithIngredients(id: number) {
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: id,
    },
  });
  if (!recipe) {
    throw new Error(`No recipe found for id: ${id}`);
  }
  const ingredients = await getRecipeIngredients(recipe);
  return {
    ...recipe,
    ingredients,
  };
}

export async function updateInstruction(id: number, instruction: string) {
  await prisma.recipe.update({
    where: {
      id: id,
    },
    data: {
      instructions: instruction,
    },
  });
}

export async function getRecipeWithIngredientsFromName(name: string) {
  const recipe = await prisma.recipe.findFirst({
    where: {
      name: name,
    },
  });
  if (!recipe) {
    throw new Error(`No recipe found for name: ${name}`);
  }
  const ingredients = await getRecipeIngredients(recipe);
  return {
    ...recipe,
    ingredients,
  };
}

async function getRecipeIngredients(recipe: Recipe) {
  const links = await prisma.recipeIngredientLink.findMany({
    where: {
      recipe: {
        id: recipe.id,
      },
    },
  });
  const ingredients = await Promise.all(
    links.map(async (link) => {
      const ingredient = await prisma.ingredient.findFirst({
        where: {
          id: link.ingredientId,
        },
      });
      if (ingredient == undefined) {
        return null;
      }
      return {
        ...ingredient,
        amount: link.amount,
      };
    }),
  );
  return ingredients.filter((i) => i != null) as Exclude<
    (typeof ingredients)[0],
    null
  >[];
}

export async function deleteIngredientLink(
  recipeId: number,
  ingredientId: number,
) {
  return prisma.recipeIngredientLink
    .deleteMany({
      where: {
        recipeId,
        ingredientId,
      },
    })
    .catch(console.error);
}

export async function getIngredients() {
  return await prisma.ingredient.findMany();
}

export async function createIngredientLink(
  ingredient: Ingredient,
  amount: number,
  recipe: Recipe,
) {
  return await prisma.recipeIngredientLink.create({
    data: {
      amount,
      ingredientId: ingredient.id,
      recipeId: recipe.id,
    },
  });
}
