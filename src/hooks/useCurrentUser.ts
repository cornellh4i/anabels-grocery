import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/types";

type UseCurrentUserReturn = {
  data: User | null;
  isLoading: boolean;
  error: Error | null;
};

// Bridges the Firebase auth user to the app's User record (id, name, role).
// TODO: remove once T1-5m's mock user hook exposes the app User.id directly.
export function useCurrentUser(): UseCurrentUserReturn {
  const { user, token, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user || !token) {
      setData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const firebaseUid = user.uid;
    let isCancelled = false;

    async function loadCurrentUser(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/users?firebaseUid=${encodeURIComponent(firebaseUid)}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }

        const users = (await response.json()) as User[];

        if (!isCancelled) {
          setData(users[0] ?? null);
        }
      } catch (caughtError: unknown) {
        if (!isCancelled) {
          setData(null);
          setError(
            caughtError instanceof Error
              ? caughtError
              : new Error("Failed to get current user"),
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      isCancelled = true;
    };
  }, [user, token, authLoading]);

  return { data, isLoading, error };
}
