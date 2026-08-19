"use client";

import { useState } from "react";
import { useDescope } from "@descope/nextjs-sdk/client";
import { Loader2 } from "lucide-react";
import { focusRing, press } from "@/lib/nb";
import GoogleGIcon from "@/components/icons/GoogleG";

type ProviderId = "google" | "microsoft";

const providers: {
	id: ProviderId;
	name: string;
	Icon: (props: { className?: string }) => React.JSX.Element;
}[] = [{ id: "google", name: "Google", Icon: GoogleGIcon }];

type Props = {
	onError: (message: string | null) => void;
};

const OAuthButtons = ({ onError }: Props) => {
	const sdk = useDescope();
	const [pending, setPending] = useState<ProviderId | null>(null);

	async function start(provider: ProviderId) {
		onError(null);
		setPending(provider);
		try {
			// Descope redirects back here with ?code=, which the callback route
			// hands to sdk.oauth.exchange() to establish the session.
			const redirectUrl = `${window.location.origin}/oauth/callback`;
			const res = await sdk.oauth.start[provider](redirectUrl);

			if (res.ok && res.data?.url) {
				// Leave `pending` set — we're navigating away, and clearing it would
				// flash the idle state before the browser unloads the page.
				window.location.assign(res.data.url);
				return;
			}

			onError(
				res.error?.errorDescription ??
					`Could not start ${provider} sign-in.`,
			);
		} catch {
			onError("Could not reach the authentication service.");
		}
		setPending(null);
	}

	return (
		<div className="space-y-3">
			{providers.map((provider) => (
				<button
					key={provider.id}
					type="button"
					disabled={pending !== null}
					onClick={() => start(provider.id)}
					className={`flex w-full items-center justify-center gap-3 border-4 border-nb-ink bg-white px-5 py-3 font-heading text-sm tracking-wide text-nb-ink uppercase ${press} ${focusRing} disabled:pointer-events-none disabled:opacity-60`}
				>
					{pending === provider.id ? (
						<Loader2
							aria-hidden
							className="size-5 animate-spin"
						/>
					) : (
						// No bordered tile: Google's guidelines want the mark unaltered
						// with clear space around it, and the button's own border-4
						// already supplies the neobrutalist frame.
						<provider.Icon className="size-5 shrink-0" />
					)}
					Continue with {provider.name}
				</button>
			))}
		</div>
	);
};

export default OAuthButtons;
