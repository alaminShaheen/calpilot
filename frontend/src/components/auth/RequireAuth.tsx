"use client";

import { ComponentType, useEffect } from "react";
import { useSession } from "@descope/nextjs-sdk/client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

/**
 * The mirror of [withRedirectIfAuthenticated] for private pages.
 *
 * This is a UX guard, NOT a security boundary — anything rendered inside it has
 * already been shipped to the browser. The real gate is the middleware, which
 * validates the session server-side before the document is ever served. Keep
 * private routes out of `publicRoutes` in middleware.ts.
 *
 * Unlike the sign-in guard, this one deliberately blocks on isSessionLoading:
 * "not authenticated yet" and "not authenticated" look identical on first
 * render, and showing the page to the former would leak a frame of private UI.
 */
export function withRequireAuth<P extends object>(
	Component: ComponentType<P>,
): ComponentType<P> {
	function RequireAuth(props: P) {
		const { isAuthenticated, isSessionLoading } = useSession();
		const router = useRouter();

		useEffect(() => {
			if (!isSessionLoading && !isAuthenticated) {
				router.replace("/sign-in");
			}
		}, [isSessionLoading, isAuthenticated, router]);

		if (isSessionLoading || !isAuthenticated) {
			return (
				<div className="flex flex-1 items-center justify-center bg-nb-paper px-4 py-12">
					<div className="flex items-center gap-3 border-4 border-nb-ink bg-white px-6 py-4 shadow-nb-lg">
						<Spinner
							aria-hidden
							className="size-6 shrink-0 text-nb-ink"
						/>
						<p className="font-heading text-lg tracking-tight text-nb-ink uppercase">
							{isSessionLoading
								? "Checking your session"
								: "Redirecting"}
						</p>
					</div>
				</div>
			);
		}

		return <Component {...props} />;
	}

	RequireAuth.displayName = `withRequireAuth(${
		Component.displayName || Component.name || "Component"
	})`;

	return RequireAuth;
}

export default withRequireAuth;
