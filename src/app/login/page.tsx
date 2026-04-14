"use client";
// TODO: Build sign in page with a single "Sign in with Cornell Google" button
// TODO: On click call signInWithPopup(auth, googleProvider)
// TODO: On success redirect to /volunteer
// TODO: On error show an error message
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";