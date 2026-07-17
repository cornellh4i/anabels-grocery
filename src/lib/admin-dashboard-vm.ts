import type { Shift } from "@/hooks/useAllShifts";
import type { SwapRequestWithDetails } from "@/hooks/useSwapRequests";

export type AvatarUser = {
  id: string;
  name: string;
  email: string;
};

export type AssigneeChipVm = {
  id: string;
  name: string;
  email: string;
};

export type ShiftCardVm = {
  id: string;
  committee: string;
  date: Date;
  timeLabel: string;
  capacityLabel: string;
  filled: number;
  capacity: number;
  isLowStaffed: boolean;
  assignees: AssigneeChipVm[];
  overflowCount: number;
};

export type WeekDayVm = {
  date: Date;
  dateKey: string;
  label: string;
  isToday: boolean;
  shifts: ShiftCardVm[];
};

export type CoverageRequestVm = {
  id: string;
  shiftLabel: string;
  requesterName: string;
  reason: string;
  capacityLabel: string;
  fulfillmentCount: number;
  status: SwapRequestWithDetails["status"];
};

export type ScheduleVm = {
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  weekStart: Date;
  weekEnd: Date;
  weekRangeLabel: string;
  days: WeekDayVm[];
};

export type AdminDashboardVm = {
  coverage: {
    items: CoverageRequestVm[];
    isLoading: boolean;
    error: Error | null;
    isEmpty: boolean;
    viewAllHref: string;
  };
  lowStaffed: {
    items: ShiftCardVm[];
    isLoading: boolean;
    error: Error | null;
    isEmpty: boolean;
    expanded: boolean;
    visibleItems: ShiftCardVm[];
  };
  schedule: ScheduleVm;
};

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTimeRange(startTime: string, endTime: string) {
  return `${startTime} - ${endTime}`;
}

function toShiftCardVm(shift: Shift): ShiftCardVm {
  const filled = shift.assignments.length;
  const isLowStaffed = filled < shift.capacity;
  const assignees = shift.assignments.map((assignment) => assignment.user);
  const visibleAssignees = getAvatarOverflow(assignees, 3);

  return {
    id: shift.id,
    committee: shift.committee,
    date: shift.date,
    timeLabel: formatTimeRange(
      shift.timeBlock.startTime,
      shift.timeBlock.endTime,
    ),
    capacityLabel: `${filled}/${shift.capacity}`,
    filled,
    capacity: shift.capacity,
    isLowStaffed,
    assignees: visibleAssignees.visible.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
    overflowCount: visibleAssignees.overflowCount,
  };
}

export function getWeekStart(date: Date) {
  const next = new Date(date);
  const day = next.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + offset);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function getStaffingStatus(shift: Shift) {
  const filled = shift.assignments.length;
  return {
    filled,
    capacity: shift.capacity,
    isLowStaffed: filled < shift.capacity,
  };
}

export function getAvatarOverflow<T extends AvatarUser>(
  assignees: T[],
  maxAvatars: number,
) {
  return {
    visible: assignees.slice(0, maxAvatars),
    overflowCount: Math.max(0, assignees.length - maxAvatars),
  };
}

export function selectLowStaffedShifts(shifts: Shift[]) {
  return shifts
    .filter((shift) => getStaffingStatus(shift).isLowStaffed)
    .slice()
    .sort((left, right) => {
      const dateDiff = left.date.getTime() - right.date.getTime();
      if (dateDiff !== 0) {
        return dateDiff;
      }

      return left.timeBlock.startTime.localeCompare(right.timeBlock.startTime);
    });
}

export function groupShiftsByDay(shifts: Shift[], weekStart: Date) {
  const todayKey = toLocalDateKey(new Date());

  return Array.from({ length: 7 }, (_, dayOffset) => {
    const date = addDays(weekStart, dayOffset);
    const dateKey = toLocalDateKey(date);
    const dayShifts = shifts
      .filter((shift) => toLocalDateKey(shift.date) === dateKey)
      .slice()
      .sort((left, right) =>
        left.timeBlock.startTime.localeCompare(right.timeBlock.startTime),
      )
      .map(toShiftCardVm);

    return {
      date,
      dateKey,
      label: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(date),
      isToday: dateKey === todayKey,
      shifts: dayShifts,
    };
  });
}

export function toAssigneeChips<T extends AvatarUser>(
  assignees: T[],
  maxAvatars = 3,
) {
  return getAvatarOverflow(assignees, maxAvatars);
}

export function toCoverageStripItems(requests: SwapRequestWithDetails[]) {
  return requests
    .filter((request) => request.status !== "CANCELLED")
    .slice()
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    )
    .map(
      (request) =>
        ({
          id: request.id,
          shiftLabel: `${request.shiftAssignment.shift.committee} · ${request.shiftAssignment.shift.timeBlock.name}`,
          requesterName: request.shiftAssignment.user.name,
          reason: request.reason ?? "No reason provided",
          capacityLabel: `Capacity ${request.shiftAssignment.shift.capacity}`,
          fulfillmentCount: request.fulfillments.length,
          status: request.status,
        }) satisfies CoverageRequestVm,
    );
}

type BuildAdminDashboardVmArgs = {
  shifts: Shift[];
  requests: SwapRequestWithDetails[];
  weekStart: Date;
  lowStaffedExpanded: boolean;
  shiftsLoading: boolean;
  shiftsError: Error | null;
  requestsLoading: boolean;
  requestsError: Error | null;
};

export function buildAdminDashboardVm({
  shifts,
  requests,
  weekStart,
  lowStaffedExpanded,
  shiftsLoading,
  shiftsError,
  requestsLoading,
  requestsError,
}: BuildAdminDashboardVmArgs): AdminDashboardVm {
  const lowStaffedItems = selectLowStaffedShifts(shifts).map(toShiftCardVm);
  const scheduleDays = groupShiftsByDay(shifts, weekStart);
  const coverageItems = toCoverageStripItems(requests);
  const weekEnd = addDays(weekStart, 6);

  return {
    coverage: {
      items: coverageItems,
      isLoading: requestsLoading,
      error: requestsError,
      isEmpty: !requestsLoading && !requestsError && coverageItems.length === 0,
      viewAllHref: "/admin/swap-requests",
    },
    lowStaffed: {
      items: lowStaffedItems,
      isLoading: shiftsLoading,
      error: shiftsError,
      isEmpty: !shiftsLoading && !shiftsError && lowStaffedItems.length === 0,
      expanded: lowStaffedExpanded,
      visibleItems: lowStaffedExpanded
        ? lowStaffedItems
        : lowStaffedItems.slice(0, 3),
    },
    schedule: {
      isLoading: shiftsLoading,
      error: shiftsError,
      isEmpty:
        !shiftsLoading &&
        !shiftsError &&
        scheduleDays.every((day) => day.shifts.length === 0),
      weekStart,
      weekEnd,
      weekRangeLabel: `${formatDate(weekStart)} - ${formatDate(weekEnd)}`,
      days: scheduleDays,
    },
  };
}
