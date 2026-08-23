import "dotenv/config";
import { z } from "zod";
import process from "node:process";

const EnvSchema = z.object({
	DATABASE_URL: z.url({
		error: "DATABASE_URL must be a valid connection URL",
	}),
	PORT: z.coerce.number().int().positive().default(4000),
	APP_URL: z.url().default("http://localhost:3000"),
	DESCOPE_PROJECT_ID: z
		.string()
		.min(1, { error: "DESCOPE_PROJECT_ID is required" }),
	DESCOPE_MANAGEMENT_KEY: z.string().min(1).optional(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("Invalid environment:\n" + z.prettifyError(parsed.error));
	process.exit(1);
}

export const env = parsed.data;
