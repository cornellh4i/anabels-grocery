import { useState, useEffect } from "react";

export type MyShift = {
  assignmentId: string;
  shift: {
    id: string;
    date: Date;
    committee: string;
    capacity: number;
  };
  timeBlock: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  };
};

type UseMyShiftsReturn = {
  data: MyShift[];
  isLoading: boolean;
  error: Error | null;
};

type ShiftAssignmentResponse = {
  id: string;
  userId: string;
  shiftId: string;
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

export function useMyShifts(
  userId: string | null | undefined,
): UseMyShiftsReturn {
  const [data, setData] = useState<MyShift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadMyShifts(): Promise<void> {
      if (!userId) {
        setData([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const assignmentsResponse = await fetch(
          `/api/shift-assignments?userId=${userId}`,
          { headers: { Accept: "application/json" } },
        );
        if (!assignmentsResponse.ok) {
          throw new Error("Failed to fetch shift assignments");
        }

        const assignments =
          (await assignmentsResponse.json()) as ShiftAssignmentResponse[];

        const nextData = assignments
          .map(
            (assignment): MyShift => ({
              assignmentId: assignment.id,
              shift: {
                id: assignment.shift.id,
                date: new Date(assignment.shift.date),
                committee: assignment.shift.committee,
                capacity: assignment.shift.capacity,
              },
              timeBlock: {
                id: assignment.shift.timeBlock.id,
                name: assignment.shift.timeBlock.name,
                startTime: assignment.shift.timeBlock.startTime,
                endTime: assignment.shift.timeBlock.endTime,
              },
            }),
          )
          .sort((a, b) => a.shift.date.getTime() - b.shift.date.getTime());

        if (!isCancelled) {
          setData(nextData);
        }
      } catch (caughtError: unknown) {
        if (!isCancelled) {
          setData([]);
          setError(
            caughtError instanceof Error
              ? caughtError
              : new Error("Failed to get shifts"),
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadMyShifts();

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return { data, isLoading, error };
}
