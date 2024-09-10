import ingestRouter from "./modules/ingest/ingest.router";
import userRouter from "./modules/user/user.router";
import { router } from "./trpc";

export const appRouter = router({
  ...userRouter,
  ...ingestRouter,
});

export type AppRouter = typeof appRouter;
