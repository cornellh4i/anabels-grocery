import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export type OpenSwapRequest = {
  swapRequestId: string;
  reason: string | null;
  shiftAssignment: {
    id: string;
    userId: string;
  };
  shift: {
    id: string;
    date: string;
    committee: string;
  };
};

type UseOpenSwapRequestsReturn = {
  data: OpenSwapRequest[];
  isLoading: boolean;
  error: Error | null;
};

type SwapRequestResponse = {
  id: string;
  status: string;
  reason: string | null;
  shiftAssignment: {
    id: string;
    userId: string;
    shift: {
      id: string;
      date: string;
      committee: string;
    };
  };
};

export function useOpenSwapRequests(): UseOpenSwapRequestsReturn {
  const { token } = useAuth();
  const [data, setData] = useState<OpenSwapRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    async function loadOpenSwapRequests(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/swap-requests", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // TODO: handle 401 — redirect to /login if token is expired or invalid
          throw new Error("Failed to fetch swap requests");
        }

        const swapRequests = (await res.json()) as SwapRequestResponse[];

        const nextData = swapRequests
          .filter((sr) => sr.status === "OPEN")
          .map((sr): OpenSwapRequest => ({
            swapRequestId: sr.id,
            reason: sr.reason,
            shiftAssignment: {
              id: sr.shiftAssignment.id,
              userId: sr.shiftAssignment.userId,
            },
            shift: {
              id: sr.shiftAssignment.shift.id,
              date: sr.shiftAssignment.shift.date,
              committee: sr.shiftAssignment.shift.committee,
            },
          }));

        if (!isCancelled) {
          setData(nextData);
        }
      } catch (caughtError: unknown) {
        if (!isCancelled) {
          setData([]);
          setError(
            caughtError instanceof Error
              ? caughtError
              : new Error("Failed to get swap requests"),
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadOpenSwapRequests();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  return { data, isLoading, error };
}