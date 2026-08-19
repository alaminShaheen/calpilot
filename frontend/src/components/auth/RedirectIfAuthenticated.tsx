import { ComponentType, useEffect } from "react";
import { useSession } from "@descope/react-sdk";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function withRedirectIfAuthenticated<P extends object>(
	Component: ComponentType<P>,
): ComponentType<P> {
	function RedirectIfAuthenticated(props: P) {
		const { isAuthenticated, isSessionLoading } = useSession();
		const router = useRouter();

		useEffect(() => {
			if (!isSessionLoading && isAuthenticated) {
				router.replace("/dashboard");
			}
		}, [isSessionLoading, isAuthenticated, router]);

		if (isSessionLoading || isAuthenticated) {
			return (
				<Button
					disabled
					size="sm"
					className="w-content mx-auto"
				>
					<Spinner data-icon="inline-start" />
					Signing in...Please wait
				</Button>
			);
		}

		return <Component {...props} />;
	}

	RedirectIfAuthenticated.displayName = `withRedirectIfAuthenticated(${
		Component.displayName || Component.name || "Component"
	})`;

	return RedirectIfAuthenticated;
}

export default withRedirectIfAuthenticated;
