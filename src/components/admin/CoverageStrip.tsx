"use client";

import Link from "next/link";
import { AngleRightIcon, BullhornIcon, CircleUserIcon } from "@/components/icons";
import { CoverageRequestCard } from "@/components/scheduling";
import type { CoverageRequestVm } from "@/lib/admin-dashboard-vm";

export interface CoverageStripProps {
  items: CoverageRequestVm[];
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  viewAllHref: string;
}

function CoverageRequestTile({ request }: { request: CoverageRequestVm }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex items-center gap-2">
        <CircleUserIcon className="size-4 text-brand-soft-text" />
        <p className="font-jakarta text-xs text-brand-soft-text">
          {request.requesterName}
        </p>
      </div>

      <CoverageRequestCard
        shiftLabel={request.shiftLabel}
        reason={request.reason}
        filled={request.fulfillmentCount}
        capacity={request.capacity}
        action={
          <Link
            href="/admin/swap-fulfillments"
            className="flex h-9 flex-1 items-center justify-center rounded-lg bg-brand-blue px-4 font-jakarta text-[10px] font-bold text-white hover:opacity-90"
          >
            COVER SHIFT
          </Link>
        }
      />
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
