"use client";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMyShifts, type MyShift } from "@/hooks/useMyShifts";
import { useAllShifts } from "@/hooks/useAllShifts";
import {
  formatHours,
  formatWeekRangeLabel,
  getWeekDays,
  getWeekRange,
  hoursBetween,
  isSameDay,
  isWithinRange,
} from "@/lib/week";

function formatShiftTime(shift: MyShift): string {
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(shift.shift.date);
  return `${dateLabel} · ${shift.timeBlock.startTime}–${shift.timeBlock.endTime}`;
}

export default function VolunteerPage() {
  const { user: firebaseUser, isLoading: authLoading } = useAuth();
  const {
    data: currentUser,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const userId = currentUser?.id ?? null;

  const {
    data: myShifts,
    isLoading: myShiftsLoading,
    error: myShiftsError,
  } = useMyShifts(userId);
  const {
    data: allShifts,
    isLoading: allShiftsLoading,
    error: allShiftsError,
  } = useAllShifts();

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedShift, setSelectedShift] = useState<MyShift | null>(null);

  const currentWeekRange = useMemo(() => getWeekRange(new Date()), []);
  const selectedWeekRange = useMemo(
    () => getWeekRange(new Date(), weekOffset),
    [weekOffset],
  );
  const weekDays = useMemo(() => getWeekDays(selectedWeekRange), [selectedWeekRange]);

  const shiftsThisWeek = useMemo(
    () => myShifts.filter((s) => isWithinRange(s.shift.date, currentWeekRange)),
    [myShifts, currentWeekRange],
  );
  const shiftsCompletedThisWeek = useMemo(
    () => shiftsThisWeek.filter((s) => s.shift.date < new Date()).length,
    [shiftsThisWeek],
  );
  const hoursThisWeek = useMemo(
    () =>
      shiftsThisWeek.reduce(
        (sum, s) => sum + hoursBetween(s.timeBlock.startTime, s.timeBlock.endTime),
        0,
      ),
    [shiftsThisWeek],
  );
  // Stand-in for "this semester": no semester date range exists in the schema
  // yet, so this sums hours across all of the volunteer's current assignments.
  const hoursThisSemester = useMemo(
    () =>
      myShifts.reduce(
        (sum, s) => sum + hoursBetween(s.timeBlock.startTime, s.timeBlock.endTime),
        0,
      ),
    [myShifts],
  );

  const upcomingShifts = useMemo(() => {
    const now = new Date();
    return myShifts.filter((s) => s.shift.date >= now).slice(0, 5);
  }, [myShifts]);

  const myShiftIds = useMemo(
    () => new Set(myShifts.map((s) => s.shift.id)),
    [myShifts],
  );
  const assignedCountByShiftId = useMemo(() => {
    const map = new Map<string, number>();
    for (const shift of allShifts) {
      map.set(shift.id, shift.assignments.length);
    }
    return map;
  }, [allShifts]);
  const shiftsBySelectedWeek = useMemo(
    () => allShifts.filter((s) => isWithinRange(s.date, selectedWeekRange)),
    [allShifts, selectedWeekRange],
  );

  const firstName = firebaseUser?.displayName?.split(" ")[0] ?? "";
  const error = userError ?? myShiftsError ?? allShiftsError;

  if (authLoading || userLoading) {
    return <p>Loading your dashboard…</p>;
  }

  if (!firebaseUser || !currentUser) {
    return <p>{userError?.message ?? "Unable to load your profile."}</p>;
  }

  return (
    <div>
      {error && <p>{error.message}</p>}

      {/* Greeting header — data ready, no T1 component named for this yet */}
      <header>
        <h1>Welcome, {firstName}!</h1>
        <p>Here&apos;s your weekly summary.</p>
      </header>

      {/* TODO(T1): replace with weekly summary Card — shiftCount={shiftsCompletedThisWeek}/{shiftsThisWeek.length}, hoursThisWeek={hoursThisWeek}, hoursThisSemester={hoursThisSemester} */}
      <section aria-label="Weekly summary">
        {myShiftsLoading ? (
          <p>Loading summary…</p>
        ) : (
          <ul>
            <li>
              Shifts this week: {shiftsCompletedThisWeek}/{shiftsThisWeek.length}
            </li>
            <li>Hours this week: {formatHours(hoursThisWeek)}</li>
            <li>Hours this semester: {formatHours(hoursThisSemester)}</li>
          </ul>
        )}
      </section>

      {/* TODO(T1): replace each entry with <ShiftCard shift={s} onClick={() => setSelectedShift(s)} /> */}
      <section aria-label="Upcoming shifts">
        <h2>Upcoming shifts</h2>
        {myShiftsLoading ? (
          <p>Loading shifts…</p>
        ) : upcomingShifts.length === 0 ? (
          <p>No shifts this week.</p>
        ) : (
          <ul>
            {upcomingShifts.map((s) => {
              const assignedCount = assignedCountByShiftId.get(s.shift.id);
              return (
                <li key={s.assignmentId}>
                  <button onClick={() => setSelectedShift(s)}>
                    {s.shift.committee} — {formatShiftTime(s)} (
                    {assignedCount ?? "?"}/{s.shift.capacity} filled)
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* TODO(T1): replace with <WeeklyCalendar weekDays={weekDays} shifts={shiftsBySelectedWeek} myShiftIds={myShiftIds} onPrevWeek={...} onToday={...} onNextWeek={...} /> */}
      <section aria-label="Weekly calendar">
        <div>
          <span>{formatWeekRangeLabel(selectedWeekRange)}</span>
          <button onClick={() => setWeekOffset((w) => w - 1)} aria-label="Previous week">
            ◄
          </button>
          <button onClick={() => setWeekOffset(0)}>Today</button>
          <button onClick={() => setWeekOffset((w) => w + 1)} aria-label="Next week">
            ►
          </button>
        </div>

        {allShiftsLoading ? (
          <p>Loading calendar…</p>
        ) : (
          <ul>
            {weekDays.map((day) => {
              const dayShifts = shiftsBySelectedWeek.filter((s) =>
                isSameDay(s.date, day),
              );
              return (
                <li key={day.toISOString()}>
                  {new Intl.DateTimeFormat(undefined, {
                    weekday: "short",
                    day: "numeric",
                  }).format(day)}
                  :{" "}
                  {dayShifts.length === 0
                    ? "—"
                    : dayShifts
                        .map((s) =>
                          myShiftIds.has(s.id) ? `${s.committee} (mine)` : s.committee,
                        )
                        .join(", ")}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* TODO(T1): replace with <ShiftDetailPopover shift={selectedShift} onClose={...} /> — actions slotted for T2-4 (join), T2-5 (drop), T2-6 (swap) */}
      {selectedShift && (
        <div role="dialog" aria-label="Shift details">
          <h3>{selectedShift.shift.committee}</h3>
          <p>{formatShiftTime(selectedShift)}</p>
          <p>
            Capacity: {assignedCountByShiftId.get(selectedShift.shift.id) ?? "?"}/
            {selectedShift.shift.capacity}
          </p>
          <button disabled>Join shift (slot — T2-4)</button>
          <button disabled>Drop shift (slot — T2-5)</button>
          <button disabled>Request swap (slot — T2-6)</button>
          <button onClick={() => setSelectedShift(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
