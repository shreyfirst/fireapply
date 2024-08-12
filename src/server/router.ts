import { initTRPC } from "@trpc/server"
import userRouter from "./modules/user/user.router"

const t = initTRPC.create()
export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = router({
	...userRouter,
})

export type AppRouter = typeof appRouter
