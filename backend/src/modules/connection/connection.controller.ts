import { type Request, type Response, Router } from "express";
import {
	createCalendarConnection,
	getCalendarConnection,
	refreshCalendarConnection,
} from "./connection.service.js";
import { requireSession } from "../auth/auth.middleware.js";
import { env } from "../../config/env.js";

export const connectionController = Router();

connectionController.use(requireSession);

connectionController.get("/", async (req: Request, res: Response) => {
	try {
		const connection = await getCalendarConnection(req.auth!.userId);
		res.json({ connection });
	} catch (e) {
		res.status(500).json({ error: "Could not load connections" });
	}
});

connectionController.post("/connect", async (req: Request, res: Response) => {
	try {
		const refreshToken = req.body.refreshToken ?? "";

		if (!refreshToken) {
			res.status(400).json({ error: "Refresh token is missing" });
		}

		const redirectUrl = req.body.redirectUrl ?? `${env.APP_URL}/dashboard`;

		const result = createCalendarConnection({
			redirectUrl,
			userId: req.auth!.userId,
			refreshToken,
		});

		res.json(result);
	} catch (e) {
		res.status(500).json({ error: "Could not start connections" });
	}
});

connectionController.post(
	"/refresh-status",
	async (req: Request, res: Response) => {
		try {
			const connection = await refreshCalendarConnection({
				userId: req.auth!.userId,
				authUserId: req.auth!.authUserId,
			});

			res.json({ connection });
		} catch (e) {
			res.status(500).json({ error: "Failed to refresh the token" });
		}
	},
);
