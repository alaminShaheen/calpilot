import cors from "cors";
import express from "express";
import { getPool } from "./db/pool.js";
import { env } from "./config/env.js";
import { connectionController } from "./modules/connection/connection.controller.js";

const app = express();

app.use(
	cors({
		origin: env.APP_URL,
		credentials: true,
	}),
);

app.use(express.json());

app.get("/healthcheck", async (req, res) => {
	try {
		await getPool().query("SELECT 1");
		res.status(200).json({
			status: "OK",
			service: "agentic-calendar-app",
			database: "Up",
		});
	} catch (e) {
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
			database: "Down",
		});
	}
});

app.use("/api/connections", connectionController);

const server = app.listen(env.PORT, () => {
	const addr = server.address();
	if (addr && typeof addr === "object") {
		const host =
			addr.address === "::" || addr.address === "0.0.0.0"
				? "localhost"
				: addr.address;
		console.log(
			`Agentic calendar app running on http://${host}:${addr.port}`,
		);
	}
});
