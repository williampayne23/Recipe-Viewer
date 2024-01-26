import { Timer } from "~/app/[recipe]/timer";
import Image from "next/image";
import { getIngredients, getRecipeWithIngredients } from "~/actions/api";
import { Instruction } from "./instructions";
import { Ingredients } from "./ingredients";

export default async function Recipe({
  params,
}: {
  params: { recipe: string };
}) {
  const numId = Number(params.recipe);
  console.log(numId);
  const recipe = await getRecipeWithIngredients(numId);
  const ingredients = await getIngredients();
  return (
    <section className="flex h-full pb-5 pt-5">
      {/* Left Collumn */}
      <div className="flex grow flex-col px-2">
        <p className="flex items-center justify-center p-2 text-center text-6xl">
          {recipe.name}
        </p>
        <Ingredients recipe={recipe} ingredients={ingredients} />
        <div className="relative m-4 mb-0 h-80 overflow-hidden rounded-lg">
          <Image
            src={recipe.image}
            fill={true}
            objectFit="cover"
            alt={recipe.name}
          />
        </div>
      </div>
      {/* Right Collumn */}
      <div className="flex grow flex-col px-2">
        <Timer />
        <h2 className="text-3xl">Instructions</h2>
        {/* <div className="w-full flex-grow p-2"> */}
        <Instruction text={recipe.instructions} id={recipe.id} />
      </div>
    </section>
  );
}
