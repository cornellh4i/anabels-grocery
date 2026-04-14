"use client";
// TODO: Create AuthContext with { user, token, isLoading }
// TODO: Create AuthProvider that listens to onAuthStateChanged
//       - when user signs in, call user.getIdToken() and store token in state
//       - when user signs out, set user and token to null
// TODO: Export useAuth() hook that returns the context
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // TODO: initialize user, token, isLoading state
  // TODO: useEffect with onAuthStateChanged listener
  // TODO: return AuthContext.Provider wrapping children
}

export function useAuth() {
  return useContext(AuthContext);
}