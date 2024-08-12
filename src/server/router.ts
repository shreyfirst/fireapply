import { initTRPC } from "@trpc/server"

const t = initTRPC.create()
export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = router({
	user: router({
		hello: publicProcedure.query(async () => {
			return "world"
		}),
	}),
})

export type AppRouter = typeof appRouter
