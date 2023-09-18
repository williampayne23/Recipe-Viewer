import Airtable from "airtable";
import { prisma } from "~/server/db";

const base = new Airtable({
  apiKey:
    "pattaWqmvCYS5RPtf.20b0fa36c887e956aa91787f23fa67e55085c0db72095d0b6cd76616f29d5be4",
}).base("appf3IS8s4qcM82G7");

function getAllOfTable(tableName: string) {
  const table = base.table(tableName);
  return new Promise((resolve, reject) => {
    table
      .select({
        view: "Grid view",
        fields: [
          "Name",
          "Instructions",
          "Ingredients Links",
          "image",
          "Next eat",
        ],
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

const meals = (await getAllOfTable("Meals")) as Meal[];
const promises = meals.map((m) => {
  return prisma.recipe
    .create({
      data: {
        name: m.fields.Name ?? "",
        nextEat:
          m.fields["Next eat"] == undefined
            ? undefined
            : new Date(m.fields["Next eat"]),
        image: `/${slugifyName(m.fields.Name)}.jpg`,
        instructions: m.fields.Instructions ?? "",
      },
    })
    .catch(console.error);
});
await Promise.all(promises).catch(console.error);
console.log("Done");

// main().catch(console.error);
