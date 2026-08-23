import { z } from "zod";

export const UserRowSchema = z.object({
	id: z.uuid(),
	auth_user_id: z.string().min(1),
	email: z.email().nullable(),
	created_at: z.date(),
});

export type UserRow = z.infer<typeof UserRowSchema>;

export const UserResponseSchema = z.object({
	id: z.uuid(),
	email: z.email().nullable(),
	createdAt: z.date(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;

export function toUserResponse(row: UserRow): UserResponse {
	return { createdAt: row.created_at, email: row.email, id: row.id };
}
