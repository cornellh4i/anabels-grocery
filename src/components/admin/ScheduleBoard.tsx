"use client";

import { useMemo } from "react";
import AdminShiftCard from "./AdminShiftCard";
import {
  CalendarDotsIcon,
  CheckboxOutlineIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/icons";
import type { ScheduleVm, ShiftCardVm } from "@/lib/admin-dashboard-vm";

const HOUR_HEIGHT = 76;
const DEFAULT_START_HOUR = 8;
const DEFAULT_END_HOUR = 21;
const FILTER_TABS = [
  "My Shifts",
  "Empty Shifts",
  "Low Coverage",
  "Covered Shifts",
  "Events",
];

export interface ScheduleBoardProps {
  schedule: ScheduleVm & {
    goPrevWeek: () => void;
    goNextWeek: () => void;
    goToday: () => void;
  };
}

function toMinutes(hhmm: string) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatHourLabel(hour: number) {
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour} ${period}`;
}

type ShiftPlacement = {
  shift: ShiftCardVm;
  start: number;
  end: number;
  lane: number;
  laneCount: number;
};

function layoutDayShifts(shifts: ShiftCardVm[]): ShiftPlacement[] {
  const withMinutes = shifts
    .map((shift) => ({
      shift,
      start: toMinutes(shift.startTime),
      end: toMinutes(shift.endTime),
    }))
    .sort((a, b) => a.start - b.start);

  const clusters: (typeof withMinutes)[] = [];
  let current: typeof withMinutes = [];
  let currentEnd = -Infinity;

  for (const item of withMinutes) {
    if (current.length > 0 && item.start >= currentEnd) {
      clusters.push(current);
      current = [];
      currentEnd = -Infinity;
    }
    current.push(item);
    currentEnd = Math.max(currentEnd, item.end);
  }
  if (current.length > 0) clusters.push(current);

  const placed: ShiftPlacement[] = [];

  for (const cluster of clusters) {
    const laneEnds: number[] = [];
    const withLanes = cluster.map((item) => {
      let lane = laneEnds.findIndex((end) => end <= item.start);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(item.end);
      } else {
        laneEnds[lane] = item.end;
      }
      return { ...item, lane };
    });
    const laneCount = laneEnds.length;
    for (const item of withLanes) {
      placed.push({ ...item, laneCount });
    }
  }

  return placed;
}

export default function ScheduleBoard({ schedule }: ScheduleBoardProps) {
  const { startHour, endHour } = useMemo(() => {
    let minStart = DEFAULT_START_HOUR * 60;
    let maxEnd = DEFAULT_END_HOUR * 60;

    for (const day of schedule.days) {
      for (const shift of day.shifts) {
        minStart = Math.min(minStart, toMinutes(shift.startTime));
        maxEnd = Math.max(maxEnd, toMinutes(shift.endTime));
      }
    }

    const start = Math.floor(minStart / 60);
    const end = Math.max(Math.ceil(maxEnd / 60), start + 1);
    return { startHour: start, endHour: end };
  }, [schedule.days]);

  const hourLabels = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
    [startHour, endHour],
  );
  const gridHeight = (endHour - startHour) * HOUR_HEIGHT;
  const nowMinutes = useMemo(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }, []);

  return (
    <section
      aria-label="Weekly schedule"
      className="flex flex-col gap-5 rounded-lg border border-brand-gray-lines bg-white p-5"
    >
      <div className="flex flex-wrap items-center gap-14">
        <div className="flex items-center gap-10 pr-9">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={schedule.goPrevWeek}
              aria-label="Previous week"
              className="text-black"
            >
              <ChevronLeftIcon className="h-[18px] w-[10px]" />
            </button>
            <p className="whitespace-nowrap font-jakarta text-2xl font-medium text-black">
              {schedule.weekRangeLabel}
            </p>
            <button
              type="button"
              onClick={schedule.goNextWeek}
              aria-label="Next week"
              className="text-black"
            >
              <ChevronRightIcon className="h-[18px] w-[10px]" />
            </button>
          </div>

          <button
            type="button"
            onClick={schedule.goToday}
            aria-label="Jump to today"
            className="text-brand-shift-text"
          >
            <CalendarDotsIcon className="size-8" />
          </button>
        </div>

        {FILTER_TABS.map((label) => (
          <div key={label} className="flex items-center gap-2.5">
            <CheckboxOutlineIcon className="size-[18px] text-brand-icon-muted" />
            <span className="whitespace-nowrap font-jakarta text-sm font-semibold text-brand-icon-muted">
              {label}
            </span>
          </div>
        ))}
      </div>

      {schedule.isLoading ? (
        <p className="font-jakarta text-sm text-brand-soft-text">
          Loading weekly schedule…
        </p>
      ) : schedule.error ? (
        <p className="font-jakarta text-sm text-brand-red">
          {schedule.error.message}
        </p>
      ) : schedule.isEmpty ? (
        <p className="font-jakarta text-sm text-brand-soft-text">
          No shifts scheduled this week.
        </p>
      ) : (
        <div className="flex">
          <div className="flex w-14 shrink-0 flex-col">
            <div className="h-11 shrink-0" />
            <div className="relative" style={{ height: gridHeight }}>
              {hourLabels.map((hour, index) => (
                <span
                  key={hour}
                  className="absolute right-2 -translate-y-1/2 whitespace-nowrap font-jakarta text-xs text-brand-soft-text"
                  style={{ top: index * HOUR_HEIGHT }}
                >
                  {formatHourLabel(hour)}
                </span>
              ))}
            </div>
          </div>

          <div className="grid flex-1 grid-cols-7 divide-x divide-brand-gray-lines">
            {schedule.days.map((day) => {
              const placements = layoutDayShifts(day.shifts);
              const showNowLine =
                day.isToday &&
                nowMinutes >= startHour * 60 &&
                nowMinutes <= endHour * 60;

              return (
                <div key={day.dateKey} className="flex flex-col">
                  <div className="flex h-11 shrink-0 items-center justify-center gap-1 border-b border-brand-gray-lines">
                    <span
                      className={`font-jakarta text-base ${
                        day.isToday
                          ? "font-bold text-brand-blue"
                          : "font-normal text-black"
                      }`}
                    >
                      {new Intl.DateTimeFormat("en-US", {
                        weekday: "short",
                      }).format(day.date)}
                    </span>
                    <span
                      className={`font-jakarta text-base ${
                        day.isToday
                          ? "font-bold text-brand-blue"
                          : "font-normal text-black"
                      }`}
                    >
                      {day.date.getDate()}
                    </span>
                  </div>

                  <div className="relative" style={{ height: gridHeight }}>
                    {hourLabels.map((hour, index) => (
                      <div
                        key={hour}
                        className="absolute inset-x-0 border-t border-brand-gray-lines"
                        style={{ top: index * HOUR_HEIGHT }}
                      />
                    ))}

                    {showNowLine ? (
                      <div
                        className="absolute inset-x-0 z-10 h-px bg-brand-red"
                        style={{
                          top:
                            ((nowMinutes - startHour * 60) / 60) *
                            HOUR_HEIGHT,
                        }}
                      />
                    ) : null}

                    {placements.map(({ shift, start, end, lane, laneCount }) => (
                      <div
                        key={shift.id}
                        className="absolute p-0.5"
                        style={{
                          top: ((start - startHour * 60) / 60) * HOUR_HEIGHT,
                          height: Math.max(
                            ((end - start) / 60) * HOUR_HEIGHT,
                            44,
                          ),
                          left: `${(lane / laneCount) * 100}%`,
                          width: `${100 / laneCount}%`,
                        }}
                      >
                        <AdminShiftCard
                          committee={shift.committee}
                          time={shift.timeLabel}
                          filled={shift.filled}
                          capacity={shift.capacity}
                          variant={shift.isLowStaffed ? "low-staffed" : "normal"}
                          assignees={shift.assignees}
                          overflowCount={shift.overflowCount}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
