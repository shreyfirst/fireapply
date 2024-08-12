import type { EntityManager } from "@mikro-orm/postgresql"
import bcrypt from "bcrypt"
import jwt from "jwt-simple"
import { User } from "../../modules/user/user.model"

const SECRET_KEY = "your_secret_key_here" // Store this securely, preferably in an environment variable

export async function generateToken(user: User): Promise<string> {
	const payload = {
		id: user.id,
		email: user.email,
	}
	return jwt.encode(payload, SECRET_KEY)
}

export async function verifyToken(
	token: string,
	em: EntityManager,
): Promise<User | null> {
	try {
		const decoded = jwt.decode(token, SECRET_KEY)
		const user = await em.findOneOrFail(
			User,
			{
				id: decoded.id,
			},
			{
				strict: true,
			},
		)
		return user as User
	} catch (error) {
		return null
	}
}

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10)
}

export async function comparePasswords(
	password: string,
	hashedPassword: string,
): Promise<boolean> {
	return bcrypt.compare(password, hashedPassword)
}
