"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDescope } from "@descope/nextjs-sdk/client";
import { Loader2, TriangleAlert } from "lucide-react";
import { focusRing, press } from "@/lib/nb";

const OAuthCallbackPage = () => {
	const router = useRouter();
	const sdk = useDescope();
	const [error, setError] = useState<string | null>(null);
	// Strict Mode runs effects twice in dev; a code can only be exchanged once.
	const exchanged = useRef(false);

	useEffect(() => {
		if (exchanged.current) {
			return;
		}
		exchanged.current = true;

		// Read from window rather than useSearchParams so this page doesn't need a
		// Suspense boundary during prerendering.
		const code = new URLSearchParams(window.location.search).get("code");
		if (!code) {
			setError(
				"No authorization code was returned. Please try signing in again.",
			);
			return;
		}

		sdk.oauth
			.exchange(code)
			.then((res) => {
				if (res.ok) {
					router.replace("/dashboard");
				} else {
					setError(
						res.error?.errorDescription ??
							"We could not complete sign-in. Please try again.",
					);
				}
			})
			.catch(() => {
				setError("Could not reach the authentication service.");
			});
	}, [router, sdk]);

	return (
		<div className="flex flex-1 items-center justify-center bg-nb-paper px-4 py-12">
			<div className="w-full max-w-md border-4 border-nb-ink bg-white p-7 shadow-nb-lg sm:p-9">
				{error ? (
					<>
						<div
							role="alert"
							className="flex items-start gap-2.5 border-4 border-nb-ink bg-nb-pink px-4 py-3 shadow-nb"
						>
							<TriangleAlert
								aria-hidden
								className="mt-px size-5 shrink-0 text-nb-ink"
							/>
							<p className="text-sm font-bold text-nb-ink">{error}</p>
						</div>
						<Link
							href="/sign-in"
							className={`mt-6 flex w-full items-center justify-center border-4 border-nb-ink bg-nb-lime px-6 py-3.5 font-heading text-base tracking-wide text-nb-ink uppercase ${press} ${focusRing}`}
						>
							Back to sign in
						</Link>
					</>
				) : (
					<div className="flex items-center gap-3">
						<Loader2
							aria-hidden
							className="size-6 shrink-0 animate-spin text-nb-ink"
						/>
						<p className="font-heading text-lg tracking-tight text-nb-ink uppercase">
							Signing you in
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default OAuthCallbackPage;
