import { getPool } from "../../db/pool.js";
import { ConnectionRow, ConnectionStatus } from "./connection.schema.js";

export const getCalendarConnectionRow = async (
	userId: string,
): Promise<ConnectionRow | null> => {
	const result = await getPool().query<ConnectionRow>(
		`
		SELECT * FROM connections WHERE user_id = $1 and provider = 'calendar'
		`,
		[userId],
	);
	return result.rows[0] ?? null;
};

export async function upsertCalendarConnection(connection: {
	userId: string;
	status: ConnectionStatus;
}) {
	// We are checking conflict on (user_id, provider) as the pair is a primary key.
	const result = await getPool().query<ConnectionRow>(
		`
		INSERT INTO connections (user_id, provider, status) 
		VALUES ($1, 'calendar', $2)
		ON CONFLICT (user_id, provider)
		DO UPDATE SET status = EXCLUDED.status
		RETURNING *
		`,
		[connection.userId, connection.status],
	);

	return result.rows[0];
}
