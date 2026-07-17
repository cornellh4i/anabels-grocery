"use client";

import { useMemo, useState } from "react";
import { useAllShifts } from "@/hooks/useAllShifts";
import { useSwapRequests } from "@/hooks/useSwapRequests";
import {
  addDays,
  buildAdminDashboardVm,
  getWeekStart,
} from "@/lib/admin-dashboard-vm";

export function useAdminDashboard() {
  const {
    data: shifts,
    isLoading: shiftsLoading,
    error: shiftsError,
  } = useAllShifts();
  const {
    data: requests,
    isLoading: reqLoading,
    error: reqError,
  } = useSwapRequests();
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [lowStaffedExpanded, setLowStaffedExpanded] = useState(false);

  const dashboard = useMemo(
    () =>
      buildAdminDashboardVm({
        shifts,
        requests,
        weekStart,
        lowStaffedExpanded,
        shiftsLoading,
        shiftsError,
        requestsLoading: reqLoading,
        requestsError: reqError,
      }),
    [
      lowStaffedExpanded,
      reqError,
      reqLoading,
      requests,
      shifts,
      shiftsError,
      shiftsLoading,
      weekStart,
    ],
  );

  return {
    ...dashboard,
    lowStaffed: {
      ...dashboard.lowStaffed,
      toggleExpanded: () => setLowStaffedExpanded((current) => !current),
    },
    schedule: {
      ...dashboard.schedule,
      goPrevWeek: () => setWeekStart((current) => addDays(current, -7)),
      goNextWeek: () => setWeekStart((current) => addDays(current, 7)),
      goToday: () => setWeekStart(getWeekStart(new Date())),
    },
  };
}
