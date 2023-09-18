"use client";
import { type RecipeWithIngredients } from "~/actions/api";

export function Ingredients({ recipe }: { recipe: RecipeWithIngredients }) {
  return (
    <div className="grow border-4 border-stone-100">
      <ul className="m-4 list-disc pl-4 text-xl">
        {recipe.ingredients.map((ingredient) => {
          return (
            <li key={ingredient.name}>
              {ingredient.amount} {ingredient.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
