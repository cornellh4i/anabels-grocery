import { NextRequest, NextResponse } from "next/server";
import type { Shift } from "@/types";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<
  NextResponse<Shift[] | { error: string }>
> {
  try {
    const shifts = await prisma.shift.findMany({
      orderBy: {
        date: "asc",
      },
      include: {
        timeBlock: true,
        user: true,
      },
    });
    return NextResponse.json(shifts);
  } catch {
    return NextResponse.json(
      { error: "Failed to get shifts" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<Shift | { error: string }>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

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
  if (typeof userId !== "string" || userId.trim() == "") {
    return NextResponse.json(
      { error: "'userId' is required and cannot be empty" },
      { status: 400 },
    );
  }

  try {
    const shift = await prisma.shift.create({
      data: { date: new Date(date), timeBlockId, userId },
    });
    return NextResponse.json(shift, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 },
    );
  }
}
