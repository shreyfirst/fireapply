import { createHash } from "node:crypto";

export const hash = (data: string | number): string => {
	return createHash("sha256").update(data.toString()).digest("hex");
};
