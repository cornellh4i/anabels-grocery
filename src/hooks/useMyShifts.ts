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
};

type ShiftResponse = {
  id: string;
  date: string;
  timeBlockId: string;
  committee: string;
  capacity: number;
};

type TimeBlockResponse = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
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
        // assignments
        const assignmentsResponse = await fetch("/api/shift-assignments", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        if (!assignmentsResponse.ok) {
          throw new Error("Failed to fetch shift assignments");
        }

        const assignments =
          (await assignmentsResponse.json()) as ShiftAssignmentResponse[];
        const myAssignments = assignments.filter(
          (assignment) => assignment.userId === userId,
        );

        // Shifts
        const shiftsResponse = await fetch("/api/shifts", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        if (!shiftsResponse.ok) {
          throw new Error("Failed to get shifts");
        }
        const shifts = (await shiftsResponse.json()) as ShiftResponse[];

        const timeBlocksResponse = await fetch("/api/time-blocks", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        if (!timeBlocksResponse.ok) {
          throw new Error("Failed to get time blocks");
        }
        const timeBlocks =
          (await timeBlocksResponse.json()) as TimeBlockResponse[];

        const shiftsById = new Map(shifts.map((shift) => [shift.id, shift]));
        const timeBlocksById = new Map(
          timeBlocks.map((timeBlock) => [timeBlock.id, timeBlock]),
        );

        // both combined
        const nextData = myAssignments
          .map((assignment): MyShift | null => {
            const shift = shiftsById.get(assignment.shiftId);
            if (!shift) {
              return null;
            }

            const timeBlock = timeBlocksById.get(shift.timeBlockId);
            if (!timeBlock) {
              return null;
            }

            return {
              assignmentId: assignment.id,
              shift: {
                id: shift.id,
                date: new Date(shift.date),
                committee: shift.committee,
                capacity: shift.capacity,
              },
              timeBlock: {
                id: timeBlock.id,
                name: timeBlock.name,
                startTime: timeBlock.startTime,
                endTime: timeBlock.endTime,
              },
            };
          })
          .filter((item): item is MyShift => item !== null)
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
