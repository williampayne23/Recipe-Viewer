import { Timer } from "app/[recipe]/timer";
import Image from "next/image";
import { getRecipeWithIngredients } from "~/utils/api";

export default async function Recipe({
  params,
}: {
  params: { recipe: string };
}) {
  const numId = Number(params.recipe);
  const recipe = await getRecipeWithIngredients(numId);
  return (
    <section>
      <div className="grid grid-cols-2">
        <p className="flex items-center justify-center p-2 text-center text-6xl">
          {recipe.name}
        </p>
        <Timer />
        <ul className="m-4 list-disc pl-4">
          {recipe.ingredients.map((ingredient) => {
            return (
              <li key={ingredient.name}>
                {ingredient.amount} {ingredient.name}
              </li>
            );
          })}
        </ul>
        <div>{recipe.instructions}</div>
        <div className="relative m-4 h-80 overflow-hidden rounded-lg">
          <Image
            src={recipe.image}
            fill={true}
            objectFit="cover"
            alt={recipe.name}
          />
        </div>
      </div>
    </section>
  );
}
