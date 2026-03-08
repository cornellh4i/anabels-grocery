import { NextRequest, NextResponse } from "next/server";
import type { SwapRequest } from "@/types";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<
  NextResponse<SwapRequest[] | { error: string }>
> {
  try {
    const requests = await prisma.swapRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        requester: true,
        shift: true,
        timeBlock: true,
      },
    });
    return NextResponse.json(requests, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to get shifts" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<SwapRequest | { error: string }>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }
  const { requesterId, shiftId, timeBlockId, reason } = body as {
    requesterId: string;
    shiftId: string;
    timeBlockId: string;
    reason?: string;
  };
  if (typeof requesterId !== "string" || requesterId.trim() == "") {
    return NextResponse.json(
      { error: "'requesterId' is required and cannot be empty" },
      { status: 400 },
    );
  }
  if (typeof shiftId !== "string" || shiftId.trim() == "") {
    return NextResponse.json(
      { error: "'shiftId' is required and cannot be empty" },
      { status: 400 },
    );
  }
  if (typeof timeBlockId !== "string" || timeBlockId.trim() == "") {
    return NextResponse.json(
      { error: "'timeBlockId' is required and cannot be empty" },
      { status: 400 },
    );
  }

  try {
    const request = await prisma.swapRequest.create({
      data: { requesterId, shiftId, timeBlockId, reason },
    });
    return NextResponse.json(request, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create swap request" },
      { status: 500 },
    );
  }
}
