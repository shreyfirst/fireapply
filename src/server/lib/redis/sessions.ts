import { randomBytes } from "node:crypto";
import type Redis from "ioredis";
import { hash } from "../helpers/hash";

const SESSION_PREFIX = "session:";
const OTP_TTL = 3600; // 1 hour in seconds

export async function validateSession(
	redis: Redis,
	token: string,
): Promise<number | null> {
	const hashedToken = hash(token);

	const key = `${SESSION_PREFIX}${hashedToken}`;
	const userId = await redis.hget(key, "userId");

	if (userId) {
		await redis.expire(key, OTP_TTL);
		return Number.parseInt(userId);
	}

	return null;
}

const generateToken = (): string => {
	return randomBytes(32).toString("hex");
};

export async function createSession(
	redis: Redis,
	userId: number,
): Promise<string> {
	const token = generateToken();
	const hashedToken = hash(token);

	const key = `${SESSION_PREFIX}${hashedToken}`;
	await redis.hset(key, "userId", userId);
	await redis.expire(key, OTP_TTL);

	return token;
}
