import { randomInt } from "node:crypto";
import type Redis from "ioredis";
import { $env } from "../../../env";
import { hash } from "../helpers/hash";

const OTP_PREFIX = "otp:";
const OTP_TTL = 600; // 10 minutes in seconds

export const OTP_MIN = 100000;
export const OTP_MAX = 999999;

const generateOTP = (): string => {
	return randomInt(OTP_MIN, OTP_MAX).toString().padStart(6, "0");
};

export async function createOTP(
	redis: Redis,
	phoneNumber: string,
): Promise<boolean> {
	try {
		const otp = generateOTP();

		if ($env.isDev) {
			console.log("input phone: ", phoneNumber);
			console.log("generated otp: ", otp);
		}

		const hashedPhoneNumber = hash(phoneNumber);
		const hashedOTP = hash(otp);
		const key = `${OTP_PREFIX}${hashedPhoneNumber}`;

		await redis.set(key, hashedOTP, "EX", OTP_TTL);
		return true;
	} catch {
		return false;
	}
}

export async function validateOTP(
	redis: Redis,
	phoneNumber: string,
	otpToValidate: number,
): Promise<boolean> {
	const hashedPhoneNumber = hash(phoneNumber);
	const key = `${OTP_PREFIX}${hashedPhoneNumber}`;
	const storedHashedOTP = await redis.get(key);

	if (storedHashedOTP && storedHashedOTP === hash(otpToValidate)) {
		// OTP is valid, delete it to prevent reuse
		await redis.del(key);
		return true;
	}

	return false;
}

export async function invalidateOTP(
	redis: Redis,
	phoneNumber: string,
): Promise<void> {
	const hashedPhoneNumber = hash(phoneNumber);
	const key = `${OTP_PREFIX}${hashedPhoneNumber}`;
	await redis.del(key);
}
