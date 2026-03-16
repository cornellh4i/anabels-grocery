import { useState, useEffect } from "react";

// TODO: Define MyShift type
// - assignmentId, shift { id, date, committee, capacity }, timeBlock { id, name, startTime, endTime }

// TODO: Define hook return type { data: MyShift[], isLoading, error }

export function useMyShifts(userId: string | null | undefined) {
  // TODO: Initialize data, isLoading, error state

  useEffect(() => {
    // TODO: If userId is null/undefined, set data to [] and return early
    // TODO: Fetch GET /api/shift-assignments filtered by userId
    // TODO: For each, fetch associated Shift then TimeBlock
    // TODO: Combine into MyShift shape, sort by shift.date ascending
    // TODO: Handle errors, set isLoading in finally
  }, [userId]);

  // TODO: Return { data, isLoading, error }
}