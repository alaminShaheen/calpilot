"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDescope } from "@descope/nextjs-sdk/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { field, focusRing, label, press, primaryButton } from "@/lib/nb";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

type Props = {
	onError: (message: string | null) => void;
};

const EmailOtp = ({ onError }: Props) => {
	const router = useRouter();
	const sdk = useDescope();

	const [step, setStep] = useState<"email" | "code">("email");
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [pending, setPending] = useState(false);
	const [cooldown, setCooldown] = useState(0);
	const codeInput = useRef<HTMLInputElement>(null);

	// Tick the resend cooldown down to zero.
	useEffect(() => {
		if (cooldown <= 0) {
			return;
		}
		const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
		return () => clearTimeout(timer);
	}, [cooldown]);

	// Move focus to the code field as soon as we ask for it.
	useEffect(() => {
		if (step === "code") {
			codeInput.current?.focus();
		}
	}, [step]);

	async function sendCode(target: string) {
		onError(null);
		setPending(true);
		try {
			// signUpOrIn creates the user on first login, so there is no separate
			// sign-up path to build.
			const res = await sdk.otp.signUpOrIn.email(target);
			if (res.ok) {
				setStep("code");
				setCooldown(RESEND_COOLDOWN_SECONDS);
			} else {
				onError(
					res.error?.errorDescription ??
						"We could not send a code to that address.",
				);
			}
		} catch {
			onError("Could not reach the authentication service.");
		} finally {
			setPending(false);
		}
	}

	async function onSubmitEmail(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const trimmed = email.trim();
		if (!trimmed) {
			onError("Enter your email address.");
			return;
		}
		setEmail(trimmed);
		await sendCode(trimmed);
	}

	async function onSubmitCode(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onError(null);
		setPending(true);
		try {
			const res = await sdk.otp.verify.email(email, code);
			if (res.ok) {
				// Session cookies are set by the SDK, so the server sees them on the
				// next navigation. Don't clear `pending` — we're leaving the page.
				router.push("/dashboard");
				return;
			}
			onError(
				res.error?.errorDescription ??
					"That code is not valid. Try again.",
			);
		} catch {
			onError("Could not reach the authentication service.");
		}
		setPending(false);
	}

	function restart() {
		onError(null);
		setCode("");
		setStep("email");
	}

	if (step === "email") {
		return (
			<form
				onSubmit={onSubmitEmail}
				className="space-y-5"
				noValidate
			>
				<div className="space-y-2">
					<label
						htmlFor="email"
						className={label}
					>
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						autoComplete="email"
						placeholder="you@example.com"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						className={field}
					/>
				</div>

				<button
					type="submit"
					disabled={pending}
					className={`${primaryButton} ${press} ${focusRing}`}
				>
					{pending && (
						<Loader2
							aria-hidden
							className="size-5 animate-spin"
						/>
					)}
					{pending ? "Sending code" : "Send me a code"}
				</button>
			</form>
		);
	}

	return (
		<form
			onSubmit={onSubmitCode}
			className="space-y-5"
			noValidate
		>
			<p
				aria-live="polite"
				className="text-sm font-medium text-nb-ink/70"
			>
				We sent a {CODE_LENGTH}-digit code to{" "}
				<span className="font-bold text-nb-ink">{email}</span>.
			</p>

			<div className="space-y-2">
				<label
					htmlFor="code"
					className={label}
				>
					Verification code
				</label>
				<input
					id="code"
					name="code"
					ref={codeInput}
					type="text"
					inputMode="numeric"
					autoComplete="one-time-code"
					required
					maxLength={CODE_LENGTH}
					placeholder="123456"
					value={code}
					onChange={(event) =>
						setCode(
							event.target.value
								.replace(/\D/g, "")
								.slice(0, CODE_LENGTH),
						)
					}
					className={`${field} text-center font-mono text-2xl tracking-[0.4em]`}
				/>
			</div>

			<button
				type="submit"
				disabled={pending || code.length < CODE_LENGTH}
				className={`${primaryButton} ${press} ${focusRing}`}
			>
				{pending && (
					<Loader2
						aria-hidden
						className="size-5 animate-spin"
					/>
				)}
				{pending ? "Verifying" : "Verify and sign in"}
			</button>

			<div className="flex items-center justify-between gap-3 text-xs font-bold">
				<button
					type="button"
					onClick={restart}
					className={`flex items-center gap-1.5 text-nb-ink underline decoration-2 underline-offset-2 hover:bg-nb-yellow ${focusRing}`}
				>
					<ArrowLeft
						aria-hidden
						className="size-3.5"
					/>
					Change email
				</button>

				<button
					type="button"
					onClick={() => sendCode(email)}
					disabled={pending || cooldown > 0}
					className={`text-nb-ink underline decoration-2 underline-offset-2 hover:bg-nb-yellow disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50 ${focusRing}`}
				>
					{cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
				</button>
			</div>
		</form>
	);
};

export default EmailOtp;
