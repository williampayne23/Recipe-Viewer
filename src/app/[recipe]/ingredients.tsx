"use client";
import {
  createIngredientLink,
  deleteIngredientLink,
  type RecipeIngredient,
  type RecipeWithIngredients,
} from "~/actions/api";
import { Combobox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { type Ingredient } from "@prisma/client";

function useOptimisticIngredients(baseIngredients: RecipeIngredient[]) {
  const [ingredients, setIngredients] = useState(baseIngredients);

  function add(i: RecipeIngredient) {
    setIngredients((ingredients) => [...ingredients, i]);
  }

  function del(i: RecipeIngredient) {
    setIngredients((ingredients) =>
      ingredients.filter((ing) => ing.id != i.id),
    );
  }

  return [ingredients, add, del] as const;
}

export function Ingredients({
  recipe,
  ingredients,
}: {
  recipe: RecipeWithIngredients;
  ingredients: Ingredient[];
}) {
  const [optimisticIngredients, add, del] = useOptimisticIngredients(
    recipe.ingredients,
  );
  return (
    <div className="overflow-scroll border-4 border-stone-100">
      <IngredientAdd ingredients={ingredients} recipe={recipe} add={add} />
      <ul className="m-4 list-disc pl-4">
        {optimisticIngredients.map((ingredient) => {
          return (
            <li key={ingredient.name}>
              <span>
                {ingredient.amount} {ingredient.name}
              </span>
              <button
                onClick={() => {
                  del(ingredient);
                  deleteIngredientLink(recipe.id, ingredient.id).catch(
                    console.error,
                  );
                }}
              >
                X
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { test } from "fuzzy";

function IngredientAdd({
  ingredients,
  recipe,
  add,
}: {
  ingredients: Ingredient[];
  recipe: RecipeWithIngredients;
  add: (i: RecipeIngredient) => void;
}) {
  const [query, setQuery] = useState("");

  const onChange = (value: Ingredient) => {
    const amountQ = query.match(/^[0-9]+/);
    let amount = 1;
    if (amountQ != null) {
      amount = Number(amountQ[0]);
    }
    createIngredientLink(value, amount, recipe).catch(console.error);
    add({
      amount: amount,
      id: value.id,
      name: value.name,
      unit: value.unit,
    });
  };

  const filteredIngredients = ingredients.filter((i) => {
    const queries = query.replace(/^[0-9]+/, "").split(" ");
    return queries.some((q) => test(q, i.name));
  });

  return (
    <Combobox onChange={onChange}>
      <Combobox.Input onChange={(event) => setQuery(event.target.value)} />
      <Combobox.Options>
        {filteredIngredients.map((i) => (
          <Combobox.Option key={i.id} value={i} as={Fragment}>
            {({ active, selected }) => (
              <li
                className={`${
                  active ? "bg-blue-500 text-white" : "bg-white text-black"
                }`}
              >
                {i.unit} {i.name}
              </li>
            )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
}
