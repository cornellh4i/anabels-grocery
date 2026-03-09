import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type Context = { params: Promise<{ id: string }> };

function isNotFound(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025';
}

export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse> {
  const { id } = await context.params;

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

    const { date, timeBlockId, committee, capacity } = body as Record<
      string,
      unknown
    >;

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

    const updatedShift = await prisma.shift.update({
      where: { id },
      data: {
        date: parsedDate,
        timeBlockId,
        committee: committee.trim(),
        capacity,
      },
    });
    return NextResponse.json(updatedShift, { status: 200 });
  } catch (err: unknown) {
    if (isNotFound(err)) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update shift' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: Context,
): Promise<NextResponse> {
  const { id } = await context.params;

  try {
    await prisma.shift.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    if (isNotFound(err)) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete shift' }, { status: 500 });
  }
}
