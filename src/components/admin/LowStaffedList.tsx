"use client";

import AdminShiftCard from "./AdminShiftCard";
import type { ShiftCardVm } from "@/lib/admin-dashboard-vm";

export interface LowStaffedListProps {
  items: ShiftCardVm[];
  visibleItems: ShiftCardVm[];
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
}

export default function LowStaffedList(props: LowStaffedListProps) {
  return (
    <section
      aria-label="Low-staffed shifts"
      className="flex flex-col gap-3 rounded-lg border border-brand-gray-lines bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <p className="font-jakarta text-base font-bold text-brand-soft-text">
          Low-staffed shifts
        </p>
        {props.items.length > 3 ? (
          <button
            type="button"
            onClick={props.onToggleExpanded}
            className="font-jakarta text-sm font-medium text-brand-blue"
          >
            {props.expanded ? "Minimize" : "Expand"}
          </button>
        ) : null}
      </div>

      {props.isLoading ? (
        <p className="font-jakarta text-sm text-brand-soft-text">
          Loading low-staffed shifts…
        </p>
      ) : props.error ? (
        <p className="font-jakarta text-sm text-brand-red">
          {props.error.message}
        </p>
      ) : props.isEmpty ? (
        <p className="font-jakarta text-sm text-brand-soft-text">
          All shifts are currently at capacity.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {props.visibleItems.map((shift) => (
            <AdminShiftCard
              key={shift.id}
              committee={shift.committee}
              time={shift.timeLabel}
              filled={shift.filled}
              capacity={shift.capacity}
              variant="low-staffed"
              assignees={shift.assignees}
              overflowCount={shift.overflowCount}
              className="h-auto"
            />
          ))}
        </div>
      )}
    </section>
  );
}
