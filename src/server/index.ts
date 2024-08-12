import fastify from "fastify"
import dev from "./lib/middleware/dev"

export const server = fastify({
	maxParamLength: 5000,
})

try {
	server.listen({ port: 3000 })
	server.register(dev)
	server.ready()
} catch (err) {
	server.log.error(err)
	process.exit(1)
}
