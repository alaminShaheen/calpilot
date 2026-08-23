import { z } from "zod";

export const ConnectionStatusSchema = z.enum([
	"connected",
	"disconnected",
	"pending",
]);

export type ConnectionStatus = z.infer<typeof ConnectionStatusSchema>;

export const ConnectionProviderSchema = z.enum(["calendar"]);

export type ConnectionProvider = z.infer<typeof ConnectionProviderSchema>;

export const ConnectionRowSchema = z.object({
	user_id: z.uuid(),
	provider: ConnectionProviderSchema,
	status: ConnectionStatusSchema,
});

export type ConnectionRow = z.infer<typeof ConnectionRowSchema>;
