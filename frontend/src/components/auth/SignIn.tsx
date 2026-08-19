"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import OAuthButtons from "@/components/auth/OauthButtons";
import EmailOtp from "@/components/auth/EmailOtp";
import PaperPlaneIcon from "@/components/icons/paper-plane";
import CalendarIcon from "@/components/icons/calendar";
import { withRedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";

const SignIn = () => {
	const [error, setError] = useState<string | null>(null);

	return (
		<div className="relative flex flex-1 items-center justify-center overflow-hidden bg-nb-paper px-4 py-12">
			{/* Grid backdrop */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--color-nb-ink)_2px,transparent_2px),linear-gradient(90deg,var(--color-nb-ink)_2px,transparent_2px)] bg-size-[32px_32px] opacity-[0.06]"
			/>

			{/* Decorative blocks — hidden on small screens. */}
			<div
				aria-hidden
				className="absolute top-20 left-[8%] hidden size-24 rotate-12 border-4 border-nb-ink bg-nb-lime shadow-nb lg:block"
			>
				<PaperPlaneIcon className="size-full text-nb-ink" />
			</div>
			<div
				aria-hidden
				className="absolute right-[10%] bottom-24 hidden size-16 -rotate-6 border-4 border-nb-ink bg-nb-sky shadow-nb lg:block"
			>
				<PaperPlaneIcon className="size-full text-nb-ink" />
			</div>
			{/* No bordered tile here — the illustration already carries its own dark
			    outline, so a box would read as a doubled frame. The hard drop-shadow
			    follows the artwork's silhouette instead. */}
			<div
				aria-hidden
				className="absolute top-1/3 right-[6%] hidden size-20 -rotate-12 lg:block"
			>
				<CalendarIcon className="size-full drop-shadow-[3px_3px_0_var(--color-nb-ink)]" />
			</div>

			<div className="relative w-full max-w-md">
				<div className="border-4 border-nb-ink bg-white p-7 shadow-nb-lg sm:p-9">
					<span className="inline-block -rotate-2 border-2 border-nb-ink bg-nb-lime px-3 py-1 font-heading text-[0.7rem] tracking-[0.2em] text-nb-ink uppercase shadow-nb-sm">
						Calpilot
					</span>

					<h1 className="mt-5 font-heading text-4xl leading-none tracking-tight text-nb-ink uppercase sm:text-5xl">
						Sign in
					</h1>
					<p className="mt-3 text-sm font-medium text-nb-ink/70">
						Your calendar, on autopilot.
					</p>

					{error && (
						<div
							role="alert"
							className="mt-6 flex items-start gap-2.5 border-4 border-nb-ink bg-nb-pink px-4 py-3 shadow-nb"
						>
							<TriangleAlert
								aria-hidden
								className="mt-px size-5 shrink-0 text-nb-ink"
							/>
							<p className="text-sm font-bold text-nb-ink">
								{error}
							</p>
						</div>
					)}

					{/* Our own buttons, fully styleable — they call sdk.oauth.start.*
					    directly instead of going through the flow widget. */}
					<div className="mt-6">
						<OAuthButtons onError={setError} />
					</div>

					<div className="my-6 flex items-center gap-3">
						<span
							aria-hidden
							className="h-1 flex-1 bg-nb-ink"
						/>
						<span className="font-heading text-xs tracking-widest text-nb-ink uppercase">
							or
						</span>
						<span
							aria-hidden
							className="h-1 flex-1 bg-nb-ink"
						/>
					</div>

					<EmailOtp onError={setError} />
				</div>

				<p className="mt-7 text-center text-sm font-medium text-nb-ink">
					Trouble signing in?{" "}
					<a
						href="mailto:support@calpilot.app"
						className="font-heading uppercase underline decoration-4 underline-offset-4 hover:bg-nb-yellow"
					>
						Get help
					</a>
				</p>
			</div>
		</div>
	);
};

export default withRedirectIfAuthenticated(SignIn);
