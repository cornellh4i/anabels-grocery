"use client";
// Temporary: dev-only mock auth, mirroring AuthContext.tsx but never touching Firebase.
// This is the stable auth module: import AuthProvider/useAuth from here.
// In development they resolve to the mocks below; in production they resolve
// to the real Firebase implementation in AuthContext.tsx. Ideally, delete
// this file though once ready for deployment.
import { createContext, useContext, useEffect, useState } from "react";
import {
  AuthProvider as FirebaseAuthProvider,
  useAuth as useFirebaseAuth,
} from "./AuthContext";

type Role = "VOLUNTEER" | "ADMIN";

// Temporary: stand-in for the User type from the auth folder
export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export const isDev = process.env.NODE_ENV === "development";

export const mockedvolunteer: AppUser = {
  id: "volunteer-1",
  name: "Andrew Zhang",
  email: "happyguineapig888@gmail.com",
  role: "VOLUNTEER",
};

export const mockedadmin: AppUser = {
  id: "admin-1",
  name: "Maia Schlesiger",
  email: "maias@gmail.com",
  role: "ADMIN",
};

type MockAuthContextType = {
  user: AppUser | null;
  token: string | null;
  isLoading: boolean;
};

const MockAuthContext = createContext<MockAuthContextType>({
  user: null,
  token: "temp-token",
  isLoading: true,
});

function MockAuthProvider({ children }: { children: React.ReactNode }) {
  // Start signed in as the mocked admin
  const [user, setUser] = useState<AppUser | null>(mockedadmin);

  // Logs the current mocked role whenever it changes
  useEffect(() => {
    console.log("Mocked Auth: :", user?.role ?? "none");
  }, [user]);

  // data hooks are expected to be dormant
  return (
    <MockAuthContext.Provider
      value={{ user, token: "stand-in-token", isLoading: false }}
    >
      {children}
      <MockUserSwitcher user={user} setUser={setUser} />
    </MockAuthContext.Provider>
  );
}

function useMockAuth() {
  return useContext(MockAuthContext);
}

export const AuthProvider = isDev ? MockAuthProvider : FirebaseAuthProvider;
export const useAuth = isDev ? useMockAuth : useFirebaseAuth;

// Switches between admin and volunteer
function MockUserSwitcher({
  user,
  setUser,
}: {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
}) {
  const mockUsers = { admin: mockedadmin, volunteer: mockedvolunteer };
  const currentEmail = user?.email;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 8,
        background: "#1f2937",
        color: "#f9fafb",
        fontSize: 12,
        fontFamily: "monospace",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      <span>mock user:</span>
      {Object.entries(mockUsers).map(([label, mockUser]) => (
        <button
          key={label}
          type="button"
          onClick={() => setUser(mockUser)}
          style={{
            padding: "2px 8px",
            borderRadius: 4,
            border: "1px solid #4b5563",
            cursor: "pointer",
            background:
              currentEmail === mockUser.email ? "#2563eb" : "transparent",
            color: "#f9fafb",
            fontSize: 12,
            fontFamily: "monospace",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
