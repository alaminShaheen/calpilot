import type { Claims } from "./auth.schema.js";

export type AuthContext = {
	authUserId: string;
	email?: string;
	name?: string;
	userId: string;
	token: Claims;
};
