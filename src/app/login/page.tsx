"use client";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/volunteer");
    } catch (err) {
      setError("Sign in failed. Please try again with a Cornell Google account.");
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
      <button
        onClick={handleSignIn}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Sign in with Cornell Google
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
