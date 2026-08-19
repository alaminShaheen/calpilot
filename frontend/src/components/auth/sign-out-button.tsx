"use client";

import { useRouter } from "next/navigation";
import { useDescope } from "@descope/nextjs-sdk/client";
import { LogOut } from "lucide-react";

const SignOutButton = () => {
	const router = useRouter();
	const sdk = useDescope();

	async function onSignOut() {
		await sdk.logout();
		router.push("/sign-in");
	}

	return (
		<button
			type="button"
			onClick={onSignOut}
			className="flex items-center gap-2 border-4 border-nb-ink bg-nb-pink px-4 py-2 font-heading text-sm tracking-wide text-nb-ink uppercase shadow-nb transition-all duration-75 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-nb-sm focus-visible:ring-4 focus-visible:ring-nb-sky focus-visible:outline-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
		>
			<LogOut
				aria-hidden
				className="size-4"
			/>
			Sign out
		</button>
	);
};

export default SignOutButton;
