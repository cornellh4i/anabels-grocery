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

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ShiftAssignment | { error: string }>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body must be valid JSON' },
      { status: 400 },
    );
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { error: 'Request body must be an object' },
      { status: 400 },
    );
  }

  const { userId, shiftId } = body as Record<string, unknown>;

  if (typeof userId !== 'string' || userId.trim() === '') {
    return NextResponse.json(
      { error: '"userId" is required and cannot be empty' },
      { status: 400 },
    );
  }

  if (typeof shiftId !== 'string' || shiftId.trim() === '') {
    return NextResponse.json(
      { error: '"shiftId" is required and cannot be empty' },
      { status: 400 },
    );
  }

  try {
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      select: {
        capacity: true,
      },
    });

    if (!shift) {
      return NextResponse.json(
        { error: `Shift with id "${shiftId}" not found` },
        { status: 404 },
      );
    }

    const currentAssignmentsCount = await prisma.shiftAssignment.count({
      where: { shiftId },
    });

    if (currentAssignmentsCount >= shift.capacity) {
      return NextResponse.json(
        { error: 'Shift has reached its capacity' },
        { status: 409 },
      );
    }

    const assignment = await prisma.shiftAssignment.create({
      data: {
        userId,
        shiftId,
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${e.message}` },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create shift assignment' },
      { status: 500 },
    );
  }
}

