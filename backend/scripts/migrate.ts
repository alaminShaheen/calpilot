import { config } from "dotenv";
import { resolve } from "node:path";
import process from "node:process";
import { readdirSync, readFileSync } from "node:fs";
import { getPool } from "../src/db/pool.js";

config({ path: resolve(process.cwd(), ".env") });

async function main() {
	const sqlDir = resolve(process.cwd(), "db-models");
	const files = readdirSync(sqlDir)
		.filter((file) => file.endsWith(".sql"))
		.sort((a, b) => a.localeCompare(b));

	const pool = getPool();

	for (const file of files) {
		const sqlFileContents = readFileSync(resolve(sqlDir, file), "utf8");
		await pool.query(sqlFileContents);
		console.log(`Migrated: db-models/${file}`);
	}

	await pool.end();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
