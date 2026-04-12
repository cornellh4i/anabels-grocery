import { useEffect, useState } from "react";
import type { SwapStatus } from "@/types";

export type SwapRequestWithDetails = {
  id: string;
  status: SwapStatus;
  reason: string | null;
  createdAt: string;
  shiftAssignment: {
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    shift: {
      id: string;
      date: string;
      committee: string;
      capacity: number;
      timeBlock: {
        id: string;
        name: string;
        startTime: string;
        endTime: string;
      };
    };
  };
  fulfillments: Array<{
    id: string;
    volunteerId: string;
    createdAt: string;
  }>;
};

type UseSwapRequestsReturn = {
  data: SwapRequestWithDetails[];
  isLoading: boolean;
  error: Error | null;
};

export function useSwapRequests(status?: SwapStatus): UseSwapRequestsReturn {
  const [data, setData] = useState<SwapRequestWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadSwapRequests(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/swap-requests", {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch swap requests");
        }

        const swapRequests = (await response.json()) as SwapRequestWithDetails[];
        const filteredRequests = status
          ? swapRequests.filter((request) => request.status === status)
          : swapRequests;
        const sortedRequests = [...filteredRequests].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        if (!isCancelled) {
          setData(sortedRequests);
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

    void loadSwapRequests();

    return () => {
      isCancelled = true;
    };
  }, [status]);

  return { data, isLoading, error };
}
