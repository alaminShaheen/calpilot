import "dotenv/config";
import cors from "cors";
import express from "express";
import { getPool } from "./db/pool.js";

const app = express();
const port = Number(process.env.PORT) || 4000;
const appOrigin = process.env.APP_URL || "http://localhost:3000";

app.use(
  cors({
    origin: appOrigin,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/healthcheck", async (req, res) => {
  try {
    await getPool().query("SELECT 1");
    res
      .status(200)
      .json({ status: "OK", service: "agentic-calendar-app", database: "Up" });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      database: "Down",
    });
  }
});

const server = app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") {
    const host =
      addr.address === "::" || addr.address === "0.0.0.0"
        ? "localhost"
        : addr.address;
    console.log(`Agentic calendar app running on http://${host}:${addr.port}`);
  }
});
