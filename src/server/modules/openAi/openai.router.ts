import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { getGPTCategory } from "./openai.entity";
export default {
  openai: router({
    categorizeEmail: publicProcedure
      .input(
        z.object({
          subject: z.string(),
          body: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { subject, body } = input;
        const categoryInfo = await getGPTCategory(subject, body);
        return categoryInfo;
      }),
  }),
};
