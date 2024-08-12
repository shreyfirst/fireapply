import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify"
import { verifyToken } from "./helpers/auth"

export async function createContext({ req, res }: CreateFastifyContextOptions) {
	let user = null
	const em = req.em

	const token = req.headers.authorization?.split(" ")[1]
	if (token) {
		user = await verifyToken(token, em)
	}

	return { user, em }
}

export type Context = Awaited<ReturnType<typeof createContext>>
