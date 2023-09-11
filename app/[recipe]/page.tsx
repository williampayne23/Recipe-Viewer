import { Timer } from "app/[recipe]/timer";
import Image from "next/image";
import { getRecipeWithIngredients } from "~/utils/api";
import { Instruction } from "./instructions";

export default async function Recipe({
  params,
}: {
  params: { recipe: string };
}) {
  const numId = Number(params.recipe);
  const recipe = await getRecipeWithIngredients(numId);
  return (
    <section className="h-[100vh] pt-10">
      <div className="flex h-full flex-row">
        {/* Left Collumn */}
        <div className="flex h-full w-[40%] flex-col">
          <p className="flex items-center justify-center p-2 text-center text-6xl">
            {recipe.name}
          </p>
          <ul className="m-4 list-disc pl-4 text-xl">
            {recipe.ingredients.map((ingredient) => {
              return (
                <li key={ingredient.name}>
                  {ingredient.amount} {ingredient.name}
                </li>
              );
            })}
          </ul>
          <div className="grow"></div>
          <div className="relative m-4 h-80 overflow-hidden rounded-lg">
            <Image
              src={recipe.image}
              fill={true}
              objectFit="cover"
              alt={recipe.name}
            />
          </div>
        </div>
        {/* Right Collumn */}
        <div className="flex grow flex-col">
          <Timer />
          <h2 className="text-3xl">Instructions</h2>
          {/* <div className="w-full flex-grow p-2"> */}
          <Instruction text={recipe.instructions} id={recipe.id} />
        </div>
      </div>
    </section>
  );
}
