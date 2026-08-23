import type { NextFunction, Request, Response } from "express";
import { descopeClient } from "../../config/descope.js";
import { ClaimsSchema } from "./auth.schema.js";
import { ensureUser } from "../users/user.repository.js";

export async function requireSession(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	const authHeader = req.headers.authorization;
	const token = authHeader?.startsWith("Bearer ")
		? authHeader.slice("Bearer ".length).trim()
		: null;
	if (!token) {
		res.status(401).send({ error: "Unauthorized", success: false });
		return;
	}

	try {
		const authInfo = await descopeClient.validateSession(token);
		const claims = ClaimsSchema.safeParse(authInfo.token);

		if (!claims.success) {
			res.status(401).send({ error: "Unauthorized", success: false });
			return;
		}

		const userRow = await ensureUser({
			authUserId: claims.data.sub,
			email: claims.data.email,
		});

		req.auth = {
			authUserId: userRow.auth_user_id,
			email: userRow.email || undefined,
			name: claims.data.name,
			userId: userRow.id,
			token: claims.data,
		};

		next();
	} catch (error: unknown) {
		res.status(401).send({ error: "Session expired", success: false });
	}
}
