"use client";

import Link from "next/link";
import { useAdminDashboard } from "./useAdminDashboard";

export default function AdminDashboardPage() {
  const dashboard = useAdminDashboard();

  return (
    <div>
      {/* greeting — no name shown; greeting UI/useAuth wiring */}
      <header>
        <h1>Welcome</h1>
        <p>
          Review coverage requests, low-staffed shifts, and the weekly schedule.
        </p>
      </header>

      {/* replace card row with <CoverageRequestCard request={request} /> per item */}
      <section aria-label="Coverage requests">
        <div>
          <h2>Coverage requests</h2>
          <Link href={dashboard.coverage.viewAllHref}>View all</Link>
        </div>

        {dashboard.coverage.isLoading ? (
          <p>Loading coverage requests…</p>
        ) : dashboard.coverage.error ? (
          <p>{dashboard.coverage.error.message}</p>
        ) : dashboard.coverage.isEmpty ? (
          <p>No coverage requests right now.</p>
        ) : (
          <ul>
            {dashboard.coverage.items.map((request) => (
              <li key={request.id}>
                {request.shiftLabel} — {request.requesterName}: {request.reason}{" "}
                ({request.capacityLabel}, {request.fulfillmentCount} fulfillment
                {request.fulfillmentCount === 1 ? "" : "s"})
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* replace list with alert-styled <ShiftCard shift={shift} variant="alert" /> per item;
          expand/collapse + alert-red tokens belong to that component, not this scaffold */}
      <section aria-label="Low-staffed shifts">
        <div>
          <h2>Low-staffed shifts</h2>
          <button type="button" onClick={dashboard.lowStaffed.toggleExpanded}>
            {dashboard.lowStaffed.expanded ? "Minimize" : "Expand"}
          </button>
        </div>

        {dashboard.lowStaffed.isLoading ? (
          <p>Loading low-staffed shifts…</p>
        ) : dashboard.lowStaffed.error ? (
          <p>{dashboard.lowStaffed.error.message}</p>
        ) : dashboard.lowStaffed.isEmpty ? (
          <p>All shifts are currently at capacity.</p>
        ) : (
          <ul>
            {dashboard.lowStaffed.visibleItems.map((shift) => (
              <li key={shift.id}>
                {shift.committee} — {shift.timeLabel} ({shift.capacityLabel})
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* replace week-nav controls + day columns with
          <WeeklyCalendar days={dashboard.schedule.days} weekRangeLabel={dashboard.schedule.weekRangeLabel}
            onPrevWeek={dashboard.schedule.goPrevWeek} onToday={dashboard.schedule.goToday}
            onNextWeek={dashboard.schedule.goNextWeek} />
          and replace each shift entry with <ShiftCard shift={shift} mode="avatar-chip" /> */}
      <section aria-label="Weekly schedule">
        <div>
          <span>Week of {dashboard.schedule.weekRangeLabel}</span>
          <button
            type="button"
            onClick={dashboard.schedule.goPrevWeek}
            aria-label="Previous week"
          >
            ◄
          </button>
          <button type="button" onClick={dashboard.schedule.goToday}>
            Today
          </button>
          <button
            type="button"
            onClick={dashboard.schedule.goNextWeek}
            aria-label="Next week"
          >
            ►
          </button>
        </div>

        {dashboard.schedule.isLoading ? (
          <p>Loading weekly schedule…</p>
        ) : dashboard.schedule.error ? (
          <p>{dashboard.schedule.error.message}</p>
        ) : dashboard.schedule.isEmpty ? (
          <p>No shifts scheduled for this week.</p>
        ) : (
          <div>
            {dashboard.schedule.days.map((day) => (
              <div key={day.dateKey}>
                <h3>
                  {day.label}
                  {day.isToday ? " (Today)" : ""}
                </h3>

                {day.shifts.length === 0 ? (
                  <p>No shifts</p>
                ) : (
                  <ul>
                    {day.shifts.map((shift) => (
                      <li key={shift.id}>
                        {shift.committee} — {shift.timeLabel} (
                        {shift.capacityLabel})
                        {shift.isLowStaffed ? " — understaffed" : ""}
                        {" — "}
                        {shift.assignees.map((a) => a.name).join(", ")}
                        {shift.overflowCount > 0
                          ? ` +${shift.overflowCount}`
                          : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
