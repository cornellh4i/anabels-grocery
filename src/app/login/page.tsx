"use client";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isSigningIn, setIsSigningIn] = useState(false);

	const handleSignIn = async () => {
		setError(null);
		setIsSigningIn(true);

		try {
			await signInWithPopup(auth, googleProvider);
			router.push("/volunteer");
		} catch {
			setError("Sign-in failed. Please try again.");
		} finally {
			setIsSigningIn(false);
		}
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
				<h1 className="text-3xl font-semibold text-gray-900">Anabel&apos;s Grocery</h1>
				<p className="mt-2 text-sm text-gray-600">Sign in with your Cornell Google account to continue.</p>

				<button
					type="button"
					onClick={handleSignIn}
					disabled={isSigningIn}
					className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isSigningIn ? "Signing in..." : "Sign in with Cornell Google"}
				</button>

				{error ? (
					<p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
				) : null}
			</div>
		</main>
	);
}