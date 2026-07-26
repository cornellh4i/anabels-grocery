"use client";

import Link from "next/link";
import {
  AngleRightIcon,
  BullhornIcon,
  CircleUserIcon,
  EmployeeGroupIcon,
} from "@/components/icons";
import type { CoverageRequestVm } from "@/lib/admin-dashboard-vm";

export interface CoverageStripProps {
  items: CoverageRequestVm[];
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  viewAllHref: string;
}

function CoverageRequestTile({ request }: { request: CoverageRequestVm }) {
  const isEmpty = request.fulfillmentCount === 0;

  return (
    <div
      className={`flex min-w-0 flex-1 flex-col gap-3 rounded-lg p-5 ${
        isEmpty
          ? "border-l-[3px] border-brand-red bg-brand-light-red"
          : "border border-brand-gray-lines bg-white"
      }`}
    >
      <p className="font-jakarta text-base text-brand-shift-text">
        {request.shiftLabel}
      </p>

      <div className="rounded-lg border border-[rgba(37,87,205,0.2)] bg-[rgba(37,87,205,0.08)] p-2">
        <p className="font-jakarta text-xs text-brand-shift-text">
          <span className="font-semibold text-[rgba(37,87,205,0.5)]">
            &ldquo;{" "}
          </span>
          {request.reason}
          <span className="font-semibold text-[rgba(37,87,205,0.5)]">
            {" "}&rdquo;
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <CircleUserIcon className="size-4 text-brand-soft-text" />
        <p className="font-jakarta text-xs text-brand-soft-text">
          {request.requesterName}
        </p>
      </div>

      <div className="flex w-full items-end gap-5">
        <div className="flex shrink-0 items-center gap-2">
          <EmployeeGroupIcon className="h-[15.75px] w-[45px]" />
          <p className="font-jakarta text-[10px] text-black">
            {request.fulfillmentCount} / {request.capacity}
          </p>
        </div>
        <Link
          href="/admin/swap-fulfillments"
          className="flex h-9 flex-1 items-center justify-center rounded-lg bg-brand-blue px-4 font-jakarta text-[10px] font-bold text-white hover:opacity-90"
        >
          COVER SHIFT
        </Link>
      </div>
    </div>
  );
}

export default function CoverageStrip(props: CoverageStripProps) {
  return (
    <section
      aria-label="Coverage requests"
      className="flex flex-col gap-3 rounded-lg border border-brand-gray-lines bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BullhornIcon className="h-[15.5px] w-[15px] text-brand-soft-text" />
          <p className="font-jakarta text-base font-bold text-brand-soft-text">
            Coverage requests
          </p>
        </div>
        <Link
          href={props.viewAllHref}
          className="flex items-center gap-2 font-jakarta text-sm font-medium text-brand-blue"
        >
          View all
          <AngleRightIcon className="h-4 w-2" />
        </Link>
      </div>

      {props.isLoading ? (
        <p className="font-jakarta text-sm text-brand-soft-text">
          Loading coverage requests…
        </p>
      ) : props.error ? (
        <p className="font-jakarta text-sm text-brand-red">
          {props.error.message}
        </p>
      ) : props.isEmpty ? (
        <p className="font-jakarta text-sm text-brand-soft-text">
          No coverage requests right now.
        </p>
      ) : (
        <div className="flex w-full items-start gap-5 overflow-x-auto">
          {props.items.map((request) => (
            <CoverageRequestTile key={request.id} request={request} />
          ))}
        </div>
      )}
    </section>
  );
}
