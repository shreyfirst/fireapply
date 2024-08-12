import { z } from "zod"
import {
	comparePasswords,
	generateToken,
	hashPassword,
} from "../../lib/helpers/auth"
import { publicProcedure, router } from "../../trpc"
import { User } from "./user.model"

export default {
	user: router({
		register: publicProcedure
			.input(z.object({ email: z.string(), password: z.string() }))
			.mutation(async ({ input, ctx }) => {
				const { email, password } = input
				const existingUser = await ctx.em.findOne(User, { email })
				if (existingUser) {
					throw new Error("User already exists")
				}
				const hashedPassword = await hashPassword(password)
				const user = ctx.em.getRepository(User).create({
					email,
					password: hashedPassword,
				})
				await ctx.em.persistAndFlush(user)
				const token = await generateToken(user)
				return { token }
			}),

		login: publicProcedure
			.input(z.object({ email: z.string().email(), password: z.string() }))
			.mutation(async ({ input, ctx }) => {
				const { email, password } = input
				const user = await ctx.em.findOne(User, { email })
				if (!user) {
					throw new Error("Invalid credentials")
				}
				const isValid = await comparePasswords(password, user.password)
				if (!isValid) {
					throw new Error("Invalid credentials")
				}
				const token = await generateToken(user)
				return { token }
			}),
	}),
}
