import { useState, useEffect } from "react";

// TODO: Define OpenSwapRequest type
// swapRequestId, reason, shiftAssignment { id, userId }, shift { id, date, committee }

// TODO: Define hook return type { data: OpenSwapRequest[], isLoading, error }

export function useOpenSwapRequests() {
  // TODO: Initialize data, isLoading, error state

  useEffect(() => {
    // TODO: Fetch GET /api/swap-requests, filter to status === "OPEN"
    // TODO: For each, fetch associated ShiftAssignment then Shift
    // TODO: Combine into OpenSwapRequest shape and set data
    // TODO: Handle errors, set isLoading in finally
  }, []);

  // TODO: Return { data, isLoading, error }
}

