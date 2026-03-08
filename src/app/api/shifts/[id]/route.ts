import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Shift } from "@/types";

type Context = { params: Promise<{ id: string }> };

export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse<Shift | { error: string }>> {
  const { id } = await context.params;
  const body = await request.json();
  const { date, timeBlockId, userId } = body as {
    date: string;
    timeBlockId: string;
    userId: string;
  };

  if (typeof date !== "string" || date.trim() == "") {
    return NextResponse.json(
      { error: "'date' is required and cannot be empty" },
      { status: 400 },
    );
  }
  if (typeof timeBlockId !== "string" || timeBlockId.trim() == "") {
    return NextResponse.json(
      { error: "'timeBlockId' is required and cannot be empty" },
      { status: 400 },
    );
  }
  if (typeof userId !== "string" || userId.trim() == "") {
    return NextResponse.json(
      { error: "'userId' is required and cannot be empty" },
      { status: 400 },
    );
  }

  try {
    const updatedShift = await prisma.shift.update({
      where: { id },
      data: { date: new Date(date), timeBlockId, userId },
    });
    return NextResponse.json(updatedShift, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Object && "code" in err) {
      if (err.code === "P2025") {
        return NextResponse.json({ error: "Shift not found" }, { status: 404 });
      }
    }
    return NextResponse.json(
      { error: "Failed to update shift" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: Context,
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  const { id } = await context.params;

  try {
    await prisma.shift.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    if (err instanceof Object && "code" in err && err.code === "P2025") {
      return NextResponse.json({ error: "Shift not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete shift" },
      { status: 500 },
    );
  }
}
