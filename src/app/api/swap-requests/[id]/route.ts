import { NextRequest, NextResponse } from "next/server";
import type { SwapRequest } from "@/types";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

function isNotFound(e: unknown): boolean {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025"
  );
}

export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse<SwapRequest | { error: string }>> {
  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Response body must be a valid JSON" },
      { status: 400 },
    );
  }

  const { status, reason } = body as Record<string, unknown>;

  if (typeof status !== "string" || status.trim() === "") {
    return NextResponse.json(
      {
        error: "'status' is required and cannot be empty",
      },
      { status: 400 },
    );
  }

  if (status !== "OPEN" && status !== "FILLED" && status !== "CANCELLED") {
    return NextResponse.json(
      {
        error: "'status' must be a valid option",
      },
      { status: 400 },
    );
  }

  const existing = await prisma.swapRequest.findUnique({ where: { id } });

  if (existing === null) {
    return NextResponse.json(
      { error: "Swap request not found" },
      { status: 404 },
    );
  }
  if (existing.status === "FILLED") {
    return NextResponse.json(
      { error: "swap request is already filled" },
      { status: 400 },
    );
  }
  if (existing.status === "CANCELLED") {
    return NextResponse.json(
      { error: "swap request is cancelled" },
      { status: 400 },
    );
  }

  if (reason !== undefined && typeof reason !== "string") {
    return NextResponse.json(
      { error: "'reason' must be a string" },
      { status: 400 },
    );
  }

  try {
    const updatedRequest = await prisma.swapRequest.update({
      where: { id },
      data: {
        status,
        reason,
      },
    });
    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (err: unknown) {
    if (isNotFound(err)) {
      return NextResponse.json(
        { error: "Swap request not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update swap request" },
      { status: 500 },
    );
  }
}
