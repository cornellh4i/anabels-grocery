"use client";

import { CoverageStrip, ScheduleBoard } from "@/components/admin";
import { useAdminDashboard } from "./useAdminDashboard";

export default function AdminDashboardPage() {
  const dashboard = useAdminDashboard();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-jakarta text-[30px] font-normal text-brand-soft-text">
        Welcome!
      </h1>

      <CoverageStrip
        items={dashboard.coverage.items}
        isLoading={dashboard.coverage.isLoading}
        error={dashboard.coverage.error}
        isEmpty={dashboard.coverage.isEmpty}
        viewAllHref={dashboard.coverage.viewAllHref}
      />

      <ScheduleBoard schedule={dashboard.schedule} />
    </div>
  );
}
