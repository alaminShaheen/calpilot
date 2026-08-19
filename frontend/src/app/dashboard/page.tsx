"use client";

import { useSession } from "@descope/nextjs-sdk/client";
import SignOutButton from "@/components/auth/sign-out-button";
import { withRequireAuth } from "@/components/auth/RequireAuth";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
	// withRequireAuth holds this component back until the session resolves, so
	// by the time we render there are claims to read. These are the same claims
	// the server used to return via session() — sub is the user ID.
	const { claims } = useSession();

	return (
		<div className="flex flex-1 flex-col bg-nb-paper px-4 py-12">
			<div className="mx-auto w-full max-w-3xl">
				<div className="flex items-start justify-between gap-4 border-4 border-nb-ink bg-white p-7 shadow-nb-lg">
					<div>
						<span className="inline-block -rotate-2 border-2 border-nb-ink bg-nb-lime px-3 py-1 font-heading text-[0.7rem] tracking-[0.2em] text-nb-ink uppercase shadow-nb-sm">
							Signed in
						</span>
						<h1 className="mt-5 font-heading text-4xl leading-none tracking-tight text-nb-ink uppercase">
							Dashboard
						</h1>
						<p className="mt-3 font-mono text-sm break-all text-nb-ink/70">
							{claims?.sub}
						</p>
					</div>
					<SignOutButton />
				</div>
			</div>
		</div>
	);
};

export default withRequireAuth(DashboardPage);
