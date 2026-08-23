import { z } from "zod";

export const ClaimsSchema = z.object({
	sub: z.string().min(1),
	email: z.email().optional(),
	name: z.string().optional(),
});

export type Claims = z.infer<typeof ClaimsSchema>;
