import { describe, expect, it } from "vitest";
import {
  FIXTURE_SHIFTS,
  FIXTURE_SWAP_REQUESTS,
  FIXTURE_USERS,
  TEST_WEEK_START,
} from "./__fixtures__/admin-dashboard.fixtures";
import {
  addDays,
  buildAdminDashboardVm,
  getAvatarOverflow,
  getStaffingStatus,
  getWeekStart,
  groupShiftsByDay,
  selectLowStaffedShifts,
  toCoverageStripItems,
} from "./admin-dashboard-vm";

describe("getWeekStart", () => {
  it("returns the preceding Monday for a mid-week date", () => {
    const weekStart = getWeekStart(new Date(2026, 6, 17)); // Friday
    expect(weekStart).toEqual(TEST_WEEK_START);
  });

  it("returns the same date when given a Monday", () => {
    const weekStart = getWeekStart(new Date(2026, 6, 13));
    expect(weekStart).toEqual(TEST_WEEK_START);
  });

  it("treats Sunday as the end of the preceding week", () => {
    const weekStart = getWeekStart(new Date(2026, 6, 19)); // Sunday
    expect(weekStart).toEqual(TEST_WEEK_START);
  });
});

describe("addDays", () => {
  it("moves forward and backward across month boundaries", () => {
    expect(addDays(new Date(2026, 6, 30), 3)).toEqual(new Date(2026, 7, 2));
    expect(addDays(new Date(2026, 6, 2), -5)).toEqual(new Date(2026, 5, 27));
  });
});

describe("getStaffingStatus / low-staffed detection", () => {
  it("flags a shift as low-staffed when assignments are under capacity", () => {
    const shift = FIXTURE_SHIFTS.find((s) => s.id === "shift-mon-understaffed")!;
    expect(getStaffingStatus(shift)).toEqual({
      filled: 1,
      capacity: 4,
      isLowStaffed: true,
    });
  });

  it("does not flag a shift that is at capacity", () => {
    const shift = FIXTURE_SHIFTS.find((s) => s.id === "shift-mon-full")!;
    expect(getStaffingStatus(shift)).toEqual({
      filled: 2,
      capacity: 2,
      isLowStaffed: false,
    });
  });

  it("flags a shift with zero assignments as low-staffed", () => {
    const shift = FIXTURE_SHIFTS.find((s) => s.id === "shift-wed-empty")!;
    expect(getStaffingStatus(shift).isLowStaffed).toBe(true);
  });
});

describe("selectLowStaffedShifts", () => {
  it("returns only under-capacity shifts, sorted by date then start time", () => {
    const result = selectLowStaffedShifts(FIXTURE_SHIFTS);
    expect(result.map((s) => s.id)).toEqual([
      "shift-mon-understaffed",
      "shift-wed-empty",
      "shift-next-mon",
    ]);
  });

  it("returns an empty array when every shift is fully staffed", () => {
    const fullyStaffed = FIXTURE_SHIFTS.filter(
      (s) => s.id === "shift-mon-full" || s.id === "shift-tue-overflow",
    );
    expect(selectLowStaffedShifts(fullyStaffed)).toEqual([]);
  });
});

describe("getAvatarOverflow (avatar +N math)", () => {
  it("shows all assignees and no overflow when under the max", () => {
    const shift = FIXTURE_SHIFTS.find((s) => s.id === "shift-mon-full")!;
    const assignees = shift.assignments.map((a) => a.user);
    const result = getAvatarOverflow(assignees, 3);
    expect(result.visible).toHaveLength(2);
    expect(result.overflowCount).toBe(0);
  });

  it("caps visible avatars and computes +N overflow", () => {
    const shift = FIXTURE_SHIFTS.find((s) => s.id === "shift-tue-overflow")!;
    const assignees = shift.assignments.map((a) => a.user);
    const result = getAvatarOverflow(assignees, 3);
    expect(result.visible.map((u) => u.id)).toEqual([
      FIXTURE_USERS.alice.id,
      FIXTURE_USERS.bob.id,
      FIXTURE_USERS.carol.id,
    ]);
    expect(result.overflowCount).toBe(2);
  });

  it("never returns a negative overflow count", () => {
    expect(getAvatarOverflow([], 3).overflowCount).toBe(0);
  });
});

describe("groupShiftsByDay", () => {
  it("returns 7 days starting from weekStart", () => {
    const days = groupShiftsByDay(FIXTURE_SHIFTS, TEST_WEEK_START);
    expect(days).toHaveLength(7);
    expect(days[0].dateKey).toBe("2026-07-13");
    expect(days[6].dateKey).toBe("2026-07-19");
  });

  it("buckets shifts onto their matching day and excludes shifts outside the week", () => {
    const days = groupShiftsByDay(FIXTURE_SHIFTS, TEST_WEEK_START);
    const monday = days.find((d) => d.dateKey === "2026-07-13")!;
    const tuesday = days.find((d) => d.dateKey === "2026-07-14")!;
    const sunday = days.find((d) => d.dateKey === "2026-07-19")!;

    expect(monday.shifts.map((s) => s.id)).toEqual([
      "shift-mon-full",
      "shift-mon-understaffed",
    ]);
    expect(tuesday.shifts.map((s) => s.id)).toEqual(["shift-tue-overflow"]);
    expect(sunday.shifts).toEqual([]);

    const allShiftIds = days.flatMap((d) => d.shifts.map((s) => s.id));
    expect(allShiftIds).not.toContain("shift-next-mon");
  });

  it("marks each shift card's isLowStaffed flag consistently with capacity", () => {
    const days = groupShiftsByDay(FIXTURE_SHIFTS, TEST_WEEK_START);
    const monday = days.find((d) => d.dateKey === "2026-07-13")!;
    const full = monday.shifts.find((s) => s.id === "shift-mon-full")!;
    const understaffed = monday.shifts.find(
      (s) => s.id === "shift-mon-understaffed",
    )!;

    expect(full.isLowStaffed).toBe(false);
    expect(full.capacityLabel).toBe("2/2");
    expect(understaffed.isLowStaffed).toBe(true);
    expect(understaffed.capacityLabel).toBe("1/4");
  });
});

describe("toCoverageStripItems", () => {
  it("excludes cancelled requests and sorts newest first", () => {
    const items = toCoverageStripItems(FIXTURE_SWAP_REQUESTS);
    expect(items.map((i) => i.id)).toEqual(["swap-open-1", "swap-filled-1"]);
  });

  it("maps requester, reason, capacity, and fulfillment count", () => {
    const items = toCoverageStripItems(FIXTURE_SWAP_REQUESTS);
    const filled = items.find((i) => i.id === "swap-filled-1")!;
    expect(filled.requesterName).toBe(FIXTURE_USERS.carol.name);
    expect(filled.reason).toBe("Out of town");
    expect(filled.capacityLabel).toBe("Capacity 4");
    expect(filled.fulfillmentCount).toBe(1);
  });

  it("falls back to a default message when no reason is given", () => {
    const [withoutReason] = toCoverageStripItems([
      { ...FIXTURE_SWAP_REQUESTS[0], reason: null },
    ]);
    expect(withoutReason.reason).toBe("No reason provided");
  });
});

describe("buildAdminDashboardVm", () => {
  const baseArgs = {
    shifts: FIXTURE_SHIFTS,
    requests: FIXTURE_SWAP_REQUESTS,
    weekStart: TEST_WEEK_START,
    lowStaffedExpanded: false,
    shiftsLoading: false,
    shiftsError: null,
    requestsLoading: false,
    requestsError: null,
  };

  it("surfaces loading state per section", () => {
    const vm = buildAdminDashboardVm({
      ...baseArgs,
      shifts: [],
      requests: [],
      shiftsLoading: true,
      requestsLoading: true,
    });
    expect(vm.coverage.isLoading).toBe(true);
    expect(vm.lowStaffed.isLoading).toBe(true);
    expect(vm.schedule.isLoading).toBe(true);
    expect(vm.coverage.isEmpty).toBe(false);
    expect(vm.lowStaffed.isEmpty).toBe(false);
    expect(vm.schedule.isEmpty).toBe(false);
  });

  it("surfaces error state per section without treating it as empty", () => {
    const shiftsError = new Error("Failed to fetch shifts");
    const requestsError = new Error("Failed to fetch swap requests");
    const vm = buildAdminDashboardVm({
      ...baseArgs,
      shifts: [],
      requests: [],
      shiftsError,
      requestsError,
    });
    expect(vm.coverage.error).toBe(requestsError);
    expect(vm.lowStaffed.error).toBe(shiftsError);
    expect(vm.schedule.error).toBe(shiftsError);
    expect(vm.coverage.isEmpty).toBe(false);
    expect(vm.lowStaffed.isEmpty).toBe(false);
  });

  it("surfaces empty state when there is no data and no error", () => {
    const vm = buildAdminDashboardVm({ ...baseArgs, shifts: [], requests: [] });
    expect(vm.coverage.isEmpty).toBe(true);
    expect(vm.lowStaffed.isEmpty).toBe(true);
    expect(vm.schedule.isEmpty).toBe(true);
  });

  it("collapses low-staffed list to 3 items when not expanded, and shows all when expanded", () => {
    const manyLowStaffed = [
      ...FIXTURE_SHIFTS,
      { ...FIXTURE_SHIFTS[3], id: "shift-wed-empty-2" },
      { ...FIXTURE_SHIFTS[3], id: "shift-wed-empty-3" },
    ];

    const collapsed = buildAdminDashboardVm({
      ...baseArgs,
      shifts: manyLowStaffed,
      lowStaffedExpanded: false,
    });
    expect(collapsed.lowStaffed.items.length).toBeGreaterThan(3);
    expect(collapsed.lowStaffed.visibleItems).toHaveLength(3);

    const expanded = buildAdminDashboardVm({
      ...baseArgs,
      shifts: manyLowStaffed,
      lowStaffedExpanded: true,
    });
    expect(expanded.lowStaffed.visibleItems).toEqual(expanded.lowStaffed.items);
  });

  it("sets a static View all href for the coverage requests page", () => {
    const vm = buildAdminDashboardVm(baseArgs);
    expect(vm.coverage.viewAllHref).toBe("/admin/swap-requests");
  });

  it("computes the week range label from weekStart", () => {
    const vm = buildAdminDashboardVm(baseArgs);
    expect(vm.schedule.weekRangeLabel).toBe("Jul 13 - Jul 19");
  });
});
