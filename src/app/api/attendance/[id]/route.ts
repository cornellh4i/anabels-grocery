import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Attendance } from "@/types";
import { verifyAdmin } from "@/lib/auth";

type Context = { params: Promise<{ id: string }> };

// PUT /api/attendance/[id] — update status, notes, or markedBy; 404 if not found
export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse<Attendance | { error: string }>> {
  try {
    const { error } = await verifyAdmin(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    // unwrap params because Next.js returns a Promise
    const { id } = await context.params;

    // parse JSON body
    const body = await request.json();
    const { status, notes, markedBy } = body;

    // update attendance record
    const updatedRecord = await prisma.attendance.update({
      where: { id },
      data: { status, notes, markedBy },
    });

    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (err: unknown) {
    console.error("PUT /api/attendance/[id] error:", err);

    // Prisma error when record not found
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Attendance record not found" },
        { status: 404 },
      );
    }

    // catch-all for other errors
    return NextResponse.json(
      { error: "Failed to update attendance record" },
      { status: 500 },
    );
  }
}
