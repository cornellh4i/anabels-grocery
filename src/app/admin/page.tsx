"use client";

import { CoverageStrip, LowStaffedList, ScheduleBoard } from "@/components/admin";
import { useAuth } from "@/context/AuthContext";
import { useAdminDashboard } from "./useAdminDashboard";

export default function AdminDashboardPage() {
  const dashboard = useAdminDashboard();
  const { user } = useAuth();
  const greetingName = user?.displayName || user?.email || "";

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-jakarta text-[30px] font-normal text-brand-soft-text">
        {greetingName ? `Welcome, ${greetingName}!` : "Welcome!"}
      </h1>

      <CoverageStrip
        items={dashboard.coverage.items}
        isLoading={dashboard.coverage.isLoading}
        error={dashboard.coverage.error}
        isEmpty={dashboard.coverage.isEmpty}
        viewAllHref={dashboard.coverage.viewAllHref}
      />

      <LowStaffedList
        items={dashboard.lowStaffed.items}
        visibleItems={dashboard.lowStaffed.visibleItems}
        isLoading={dashboard.lowStaffed.isLoading}
        error={dashboard.lowStaffed.error}
        isEmpty={dashboard.lowStaffed.isEmpty}
        expanded={dashboard.lowStaffed.expanded}
        onToggleExpanded={dashboard.lowStaffed.toggleExpanded}
      />

      <ScheduleBoard schedule={dashboard.schedule} />
    </div>
  );
}
