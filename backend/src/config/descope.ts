import process from "node:process";
import DescopeClient from "@descope/node-sdk";
import { env } from "./env.js";

export const descopeClient = DescopeClient({
	projectId: env.DESCOPE_PROJECT_ID,
	managementKey: env.DESCOPE_MANAGEMENT_KEY,
});
