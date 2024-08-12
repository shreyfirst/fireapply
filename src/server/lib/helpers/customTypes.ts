import { parsePhoneNumber, validatePhoneNumberLength } from "libphonenumber-js";
import { z } from "zod";

export const phoneNumberType = z
	.string()
	.refine(
		(value) => {
			return validatePhoneNumberLength(value) == null;
		},
		{
			message: "Invalid phone number format",
		},
	)
	.transform((value) => {
		const parsedNumber = parsePhoneNumber(value);
		return parsedNumber?.formatInternational();
	});

export const usernameType = z
	.string()
	.min(3)
	.max(20)
	.transform((string, ctx) => {
		const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

		if (!USERNAME_REGEX.test(string)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Invalid username",
				path: [],
			});
			return z.NEVER;
		}

		return string.toLowerCase();
	});
