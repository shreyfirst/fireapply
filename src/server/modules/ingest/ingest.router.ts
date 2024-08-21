import { z } from "zod"
import { publicProcedure, router } from "../../trpc"

export default {
	ingest: router({
		incoming_mail: publicProcedure
			.input(z.object({ email: z.string(), password: z.string() }))
			.mutation(async ({ input, ctx }) => {}),
	}),
}
