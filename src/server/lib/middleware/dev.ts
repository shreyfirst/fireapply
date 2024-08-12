import cors from "@fastify/cors"
import {
	type FastifyTRPCPluginOptions,
	fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify"
import type { FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"
import { $env } from "../../../../env"
import { type AppRouter, appRouter } from "../../router"
import { createContext } from "../context"

const dev: FastifyPluginAsync = async (fastify) => {
	if (!$env.isDev) return

	await fastify.register(cors, {
		origin: ["http://localhost:3000"],
	})

	await fastify.register(fastifyTRPCPlugin, {
		prefix: "/trpc",
		trpcOptions: {
			router: appRouter,
			createContext,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			onError({ path, error }: any) {
				console.error(`Error in tRPC handler on path '${path}':`, error)
			},
		} as FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
	})
}

export default fp(dev)
