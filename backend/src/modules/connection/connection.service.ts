import {
	getCalendarConnectionRow,
	upsertCalendarConnection,
} from "./connection.repository.js";
import { CONNECTION_LABEL } from "./connection.constant.js";
import { ConnectionStatus } from "./connection.schema.js";
import { ConnectionRequest } from "./connection.type.js";
import { descopeClient } from "../../config/descope.js";
import { env } from "../../config/env.js";

export async function getCalendarConnection(userId: string) {
	const row = await getCalendarConnectionRow(userId);

	return {
		label: CONNECTION_LABEL,
		status: row?.status ?? ("disconnected" as ConnectionStatus),
	};
}

export async function createCalendarConnection(
	connectionRequest: ConnectionRequest,
) {
	const response = await descopeClient.outbound.connect(
		env.DESCOPE_CALENDAR_CONNECTION_ID,
		{
			redirectUrl: connectionRequest.redirectUrl,
		},
		connectionRequest.refreshToken,
	);

	if (!response.ok || !response.data?.url) {
		throw new Error("Could not start connection");
	}

	await upsertCalendarConnection({
		userId: connectionRequest.userId,
		status: "pending",
	});

	return { url: response.data.url };
}

export async function refreshCalendarConnection(connectionIds: {
	userId: string;
	authUserId: string;
}) {
	const response =
		await descopeClient.management.outboundApplication.fetchToken(
			env.DESCOPE_CALENDAR_CONNECTION_ID,
			connectionIds.authUserId,
		);

	const status = response.ok && response.data ? "connected" : "disconnected";

	const row = await upsertCalendarConnection({
		userId: connectionIds.userId,
		status,
	});

	return {
		label: CONNECTION_LABEL,
		status: row.status,
	};
}
