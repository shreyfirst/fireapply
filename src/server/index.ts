import {
	type FastifyTRPCPluginOptions,
	fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify"
import fastify from "fastify"
import { createContext } from "./lib/context"
import dev from "./lib/middleware/dev"
import mikrorm from "./lib/middleware/mikrorm"
import { type AppRouter, appRouter } from "./router"

export const server = fastify({
	maxParamLength: 5000,
})

const main = async (): Promise<void> => {
	await server.register(fastifyTRPCPlugin, {
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

	await server.register(dev)

	await server.register(mikrorm)

	await server.ready()
	server.listen({ port: 3000 })
}
main().catch((error) => {
	server.log.error(error)
	process.exit(1)
})
