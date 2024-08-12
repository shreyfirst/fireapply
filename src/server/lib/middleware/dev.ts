import cors from "@fastify/cors"
import type { FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"
import { renderTrpcPanel } from "trpc-panel"
import { $env } from "../../../../env"
import { appRouter } from "../../router"

const dev: FastifyPluginAsync = async (fastify) => {
	if (!$env.isDev) return

	await fastify.register(cors, {
		origin: ["http://localhost:3000"],
	})

	await fastify.get("/panel", async (req, res) => {
		res.type("text/html").send(
			renderTrpcPanel(appRouter, {
				url: "http://localhost:3000/trpc",
				transformer: "superjson",
			}),
		)
	})
}

export default fp(dev)
