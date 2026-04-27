import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export type Shift = {
  id: string;
  date: Date;
  committee: string;
  capacity: number;
  timeBlock: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  };
  assignments: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
};

type UseAllShiftsReturn = {
  data: Shift[];
  isLoading: boolean;
  error: Error | null;
};

export function useAllShifts(committee?: string): UseAllShiftsReturn {
  const { token } = useAuth();
  const [allShifts, setAllShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    async function loadAllShifts(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/shifts", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // TODO: handle 401 — redirect to /login if token is expired or invalid
          throw new Error("Failed to fetch shifts");
        }

        const shifts = (await response.json()) as Shift[];
        const nextData = shifts.map(
          (shift): Shift => ({
            id: shift.id,
            date: new Date(shift.date),
            committee: shift.committee,
            capacity: shift.capacity,
            timeBlock: {
              id: shift.timeBlock.id,
              name: shift.timeBlock.name,
              startTime: shift.timeBlock.startTime,
              endTime: shift.timeBlock.endTime,
            },
            assignments: shift.assignments.map((assignment) => ({
              id: assignment.id,
              userId: assignment.userId,
              user: {
                id: assignment.user.id,
                name: assignment.user.name,
                email: assignment.user.email,
              },
            })),
          }),
        );

        if (!isCancelled) {
          setAllShifts(nextData);
        }
      } catch (caughtError: unknown) {
        if (!isCancelled) {
          setAllShifts([]);
          setError(
            caughtError instanceof Error
              ? caughtError
              : new Error("Failed to fetch shifts"),
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadAllShifts();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  const data = useMemo(() => {
    return allShifts
      .filter((shift) => !committee || shift.committee === committee)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [allShifts, committee]);

  return { data, isLoading, error };
}
