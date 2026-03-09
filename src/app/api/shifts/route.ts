import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const shifts = await prisma.shift.findMany({
      orderBy: {
        date: 'asc',
      },
      include: {
        timeBlock: true,
        assignments: {
          include: {
            user: true,
          },
        },
      },
    });
    return NextResponse.json(shifts);
  } catch {
    return NextResponse.json({ error: 'Failed to get shifts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
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

    const { date, timeBlockId, committee, capacity } = body as Record<string, unknown>;

    if (typeof date !== 'string' || date.trim() === '') {
      return NextResponse.json(
        { error: '"date" is required and cannot be empty' },
        { status: 400 },
      );
    }
    const parsedDate = new Date(date);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: '"date" must be a valid ISO 8601 date string' },
        { status: 400 },
      );
    }

    if (typeof timeBlockId !== 'string' || timeBlockId.trim() === '') {
      return NextResponse.json(
        { error: '"timeBlockId" is required and cannot be empty' },
        { status: 400 },
      );
    }

    if (typeof committee !== 'string' || committee.trim() === '') {
      return NextResponse.json(
        { error: '"committee" is required and cannot be empty' },
        { status: 400 },
      );
    }

    if (
      typeof capacity !== 'number' ||
      !Number.isInteger(capacity) ||
      capacity <= 0
    ) {
      return NextResponse.json(
        { error: '"capacity" must be a positive integer' },
        { status: 400 },
      );
    }

    const shift = await prisma.shift.create({
      data: {
        date: parsedDate,
        timeBlockId,
        committee: committee.trim(),
        capacity,
      },
    });
    return NextResponse.json(shift, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${e.message}` },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: 'Failed to create shift' }, { status: 500 });
  }
}
