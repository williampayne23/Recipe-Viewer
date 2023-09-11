import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const exampleRouter = createTRPCRouter({
  updateInstruction: publicProcedure
    .input(
      z.object({
        instruction: z.string(),
        id: z.number(),
      }),
    )
    .mutation(({ input }) => {
      prisma.recipe
        .update({
          where: {
            id: input.id,
          },
          data: {
            instructions: input.instruction,
          },
        })
        .catch(console.error);
    }),
});
