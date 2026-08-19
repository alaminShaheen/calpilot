import type { Metadata } from "next";
import { Archivo_Black, Exo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@descope/nextjs-sdk";
import { CookieConfig } from "@descope/web-js-sdk";

// Variable font, so no `weight` — the full 100–900 range is available.
const exo = Exo({
	variable: "--font-sans",
	subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
	variable: "--font-heading",
	weight: "400",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Calpilot",
	description: "Your calendar, on autopilot.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID ?? "";
	const cookieConfig: CookieConfig = {
		sameSite: "Lax",
		secure: process.env.NODE_ENV !== "development",
	};
	return (
		<AuthProvider
			projectId={projectId}
			refreshTokenViaCookie={cookieConfig}
			sessionTokenViaCookie={cookieConfig}
		>
			<html
				lang="en"
				className={`${exo.variable} ${archivoBlack.variable} ${geistMono.variable} h-full antialiased`}
			>
				{/* Extensions (ColorZilla, Grammarly, ...) stamp attributes onto
				    <body> before React hydrates, which reads as a mismatch. This
				    suppresses the warning for this element's own attributes only
				    — one level deep, so real mismatches inside still surface. */}
				<body
					suppressHydrationWarning
					className="flex min-h-full flex-col"
				>
					{children}
				</body>
			</html>
		</AuthProvider>
	);
}
