import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ShiftAssignment } from '@/types';

export async function GET(): Promise<
  NextResponse<ShiftAssignment[] | { error: string }>
> {
  try {
    const assignments = await prisma.shiftAssignment.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        user: true,
        shift: {
          include: {
            timeBlock: true,
          },
        },
      },
    });

    return NextResponse.json(assignments);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch shift assignments' },
      { status: 500 },
    );
  }
}

// TODO: create a new shift assignment
// Required fields: userId (string), shiftId (string)
// Before creating, check that the shift exists and has not exceeded capacity
// Return 400 if fields are missing, 404 if shift not found, 409 if at capacity, 201 on success
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ShiftAssignment | { error: string }>> {
  void request;
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}