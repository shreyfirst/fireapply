import type { FastifyPluginAsync, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import type { User } from "../../modules/users/user.entity"

declare module "fastify" {
	interface FastifyRequest {
		user: User | null
		authUser: User
		authenticate: () => void
	}
}

const punish = (request: FastifyRequest): void => {
	if (!request.user) {
		throw new Error() //unauthorized.toCatch("Unauthorized");
	}
	request.authUser = request.user
}

const auth: FastifyPluginAsync = async (fastify) => {
	await fastify.decorate("user", null)
	await fastify.decorate("authUser", undefined)
	await fastify.decorate("authenticate", async () => {
		// authenticate function assigned in preHandler
	})

	await fastify.addHook("preHandler", async (request) => {
		request.authenticate = () => punish(request)
		const authHeader = request.headers.authorization
		const authHeaderSplit = authHeader?.split(" ")
		if (authHeaderSplit && authHeaderSplit.length === 2) {
			const token = authHeaderSplit[1]
			if (token.length === 64) {
				// const redisSession = await validateSession(request.server.redis, token)
				// if (redisSession) {
				// 	const user = await request.em
				// 		.getRepository(User)
				// 		.findOneOrFail({
				// 			id: redisSession,
				// 		})
				// 		.then((res) => {
				// 			return res
				// 		})
				// 		.catch(() => {
				// 			throw new Error()
				// 		})
				// 	request.user = user
				}
			}
		}
}
)
}

export default fp(auth)
