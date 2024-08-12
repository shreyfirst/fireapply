import userRouter from "./modules/user/user.router"
import { router } from "./trpc"

export const appRouter = router({
	...userRouter,
})

export type AppRouter = typeof appRouter
