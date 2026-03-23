import { useState, useEffect } from "react";

// TODO: Define OpenSwapRequest type
// swapRequestId, reason, shiftAssignment { id, userId }, shift { id, date, committee }
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

// TODO: Define hook return type { data: OpenSwapRequest[], isLoading, error }
type UseOpenSwapRequestsReturn = {
  data: OpenSwapRequest[];
  isLoading: boolean;
  error: Error | null;
};

export function useOpenSwapRequests() {
  // TODO: Initialize data, isLoading, error state
  const [data, setData] = useState<OpenSwapRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: Fetch GET /api/swap-requests, filter to status === "OPEN"
    // TODO: For each, fetch associated ShiftAssignment then Shift
    // TODO: Combine into OpenSwapRequest shape and set data
    // TODO: Handle errors, set isLoading in finally

    const fetchOpenSwapRequests = async () => {
      try {
        const swapRes = await fetch("/api/swap-requests");
        if (!swapRes.ok) throw new Error("Failed to fetch swap requests");
        const swapRequests: any[] = await swapRes.json();

        const openSwapRequests = swapRequests.filter(sr => sr.status === "OPEN");

        const requestsWithDetails: OpenSwapRequest[] = [];

        for (const sr of openSwapRequests) {
          try {
            const assignRes = await fetch(`/api/shift-assignments/${sr.shiftAssignmentId}`);
            if (!assignRes.ok) throw new Error("Failed to fetch shift assignment");
            const shiftAssignment = await assignRes.json();

            const shiftRes = await fetch(`/api/shifts/${shiftAssignment.shiftId}`);
            if (!shiftRes.ok) throw new Error("Failed to fetch shift");
            const shift = await shiftRes.json();

            requestsWithDetails.push({
              swapRequestId: sr.id,
              reason: sr.reason || null,
              shiftAssignment: {
                id: shiftAssignment.id,
                userId: shiftAssignment.userId,
              },
              shift: {
                id: shift.id,
                date: shift.date,
                committee: shift.committee,
              },
            });
          } catch (innerErr) {
            console.error("Skipping swap request due to fetch error", sr.id, innerErr);
            // skip this one but continue
          }
        }

        setData(requestsWithDetails);
      } catch (err: any) {
        setError(err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpenSwapRequests();
  }, []);

  // TODO: Return { data, isLoading, error }
  return { data, isLoading, error };
}

