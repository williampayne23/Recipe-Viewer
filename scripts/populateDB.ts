import Airtable from "airtable";
import { prisma } from "~/server/db";

const base = new Airtable({
  apiKey:
    "pattaWqmvCYS5RPtf.20b0fa36c887e956aa91787f23fa67e55085c0db72095d0b6cd76616f29d5be4",
}).base("appf3IS8s4qcM82G7");

function getAllOfTable(tableName: string, fields: string[]) {
  const table = base.table(tableName);
  return new Promise((resolve, reject) => {
    table
      .select({
        view: "Grid view",
        fields: fields,
      })
      .all((err, records) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(records);
      });
  });
}

type Meal = {
  id: string;
  fields: {
    Name: string;
    image: [
      {
        id: string;
        url: string;
        filename: string;
        size: number;
        type: string;
      },
    ];
    "Ingredients Links"?: string[];
    "Next eat"?: string;
    Instructions?: string;
  };
};

import fs from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { PrismaClient } from "@prisma/client";
const downloadFile = async (url: string, folder = ".") => {
  const res = await fetch(url);
  if (!fs.existsSync("downloads")) await mkdir("downloads"); //Optional if you already have downloads directory
  const destination = path.resolve("./public", folder);
  const fileStream = fs.createWriteStream(destination, { flags: "wx" });
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
};

function slugifyName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type Ingredient = {
  id: string;
  fields: {
    Name: string;
    Unit: string;
  };
};

type IngredientLink = {
  id: string;
  fields: {
    Meals: string;
    Ingredient: string;
    Amount: number;
  };
};

const meals = (await getAllOfTable("Meals", [
  "Name",
  "Instructions",
  "Ingredients Links",
  "image",
  "Next eat",
])) as Meal[];
const ingredients = (await getAllOfTable("Ingredients", [
  "Name",
  "Unit",
])) as Ingredient[];
const ingredientLinks = (await getAllOfTable("Meal <-> Ingredients", [
  "Meals",
  "Ingredient",
  "Amount",
])) as IngredientLink[];

const links = ingredientLinks.map((l) => {
  const meal = meals.find((m) => l.fields.Meals.includes(m.id));
  const ingredient = ingredients.find((m) =>
    l.fields.Ingredient.includes(m.id),
  );
  if (meal == undefined) return null;
  if (ingredient == undefined) return null;
  return {
    meal,
    ingredient,
    amount: l.fields.Amount,
  };
});

//eslint-disable-next-line @typescript-eslint/no-misused-promises
await Promise.all(
  links.map(async (l) => {
    if (l == null) return;
    const meal = await prisma.recipe.findFirst({
      where: {
        name: l.meal.fields.Name,
      },
    });
    const ingredient = await prisma.ingredient.findFirst({
      where: {
        name: l.ingredient.fields.Name,
      },
    });
    if (meal == null) {
      console.log("NO MEAL");
      return;
    }
    if (ingredient == null) {
      console.log("NO INGREDIENT");
      return;
    }
    return await prisma.recipeIngredientLink.create({
      data: {
        ingredientId: ingredient.id,
        recipeId: meal.id,
        amount: l.amount,
      },
    });
  }),
);
