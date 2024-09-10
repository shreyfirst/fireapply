import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export default {
  ingest: router({
    incoming_mail: publicProcedure
      .input(
        z.object({
          from: z.string().email(),
          to: z.string().email(),
          subject: z.string(),
          textBody: z.string(),
          htmlBody: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await ctx.queues.EmailQueue.queue.add("processEmail", input);
        return { success: true, message: "Email queued for processing" };
      }),
  }),
};
