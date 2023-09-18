import { getRecipes } from "~/actions/api";
import Image from "next/image";
import Link from "next/link";

export default async function RecipeList() {
  const recipes = await getRecipes();

  return (
    <div className="m-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {recipes.map((recipe) => {
        const image = recipe.image == "" ? "/placeholder.jpg" : recipe.image;
        return (
          <Link
            className="cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            key={recipe.id}
            href={`/${recipe.id}`}
          >
            <div className="relative h-44 w-full">
              <Image objectFit="cover" src={image} fill={true} alt="" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold">{recipe.name}</h2>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
