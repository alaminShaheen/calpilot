import { authMiddleware } from "@descope/nextjs-sdk/server";

/**
 * Deny-by-default: anything not listed in publicRoutes requires a session, and
 * unauthenticated requests get redirected to redirectUrl. Add new public pages
 * here as you build them (/sign-up, /forgot-password, ...).
 *
 * The project ID must come from the NEXT_PUBLIC_ var — it's the only one this
 * app defines. Passing DESCOPE_PROJECT_ID here read as undefined and silently
 * fell through to the SDK's own env lookup, so the explicit argument was doing
 * nothing.
 */
export default authMiddleware({
	projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID,
	redirectUrl: "/sign-in",
	// /oauth/callback MUST be public — it runs before a session exists, so
	// gating it would redirect the OAuth return trip straight back to sign-in.
	publicRoutes: ["/", "/sign-in", "/oauth/callback"],
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
