"use server";

import { type Recipe } from "@prisma/client";
import { prisma } from "~/server/db";

export async function getRecipes() {
  return await prisma.recipe.findMany();
}

export type RecipeWithIngredients = Awaited<
  ReturnType<typeof getRecipeWithIngredients>
>;

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
