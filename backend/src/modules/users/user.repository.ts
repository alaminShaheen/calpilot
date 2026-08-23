import { UserRow } from "./user.schema.js";
import { getPool } from "../../db/pool.js";

export async function ensureUser(userInfo: {
	authUserId: string;
	email?: string;
}): Promise<UserRow> {
	/**
	 * Insert the user, or update them if they already exist — in a single statement.
	 *
	 * WHY NOT SELECT-THEN-INSERT: this runs on every authenticated request, so it
	 * has to be correct under concurrency. Checking "does this user exist?" and
	 * then branching to an INSERT or UPDATE leaves a gap between the check and the
	 * write: two requests from the same brand-new user can both see "not found"
	 * and both attempt the INSERT, and the loser dies on the unique constraint.
	 *
	 * Since auth_user_id is unique, for an already existing user there will be a conflict
	 * as a row with auth_user_id is already present. So trying to insert another row with
	 * the same auth_user_id will result in a conflict. On conflict, we are asking to set
	 * the email as COALESCE(EXCLUDED.email, users.email) where EXCLUDED.email is the email
	 * that would've been set for the new row. The fallback is the users.email which is the
	 * already existing email. This ensures that correct email is set if the user email of
	 * an existing user ever changes. COALESCE also preserves the stored email when the
	 * incoming value is NULL. Session claims don't always carry an email, and a login
	 * without one must not erase an address we already have.
	 **/
	const result = await getPool().query<UserRow>(
		`
		INSERT INTO users (auth_user_id, email)
		VALUES ($1, $2)
		ON CONFLICT (auth_user_id)
		DO UPDATE SET email = COALESCE(EXCLUDED.email, users.email)
		RETURNING *
		`,
		[userInfo.authUserId, userInfo.email],
	);

	return result.rows[0];
}
