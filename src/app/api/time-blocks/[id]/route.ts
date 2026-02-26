import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { TimeBlock } from '@/types';

type Context = { params: Promise<{ id: string }> };

/** Returns true when a Prisma error is a missing record (P2025). */
function isNotFound(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025';
}

/** Checks that the value is a string in HH:MM format. */
function isValidTime(value: unknown): value is string {
  return typeof value === 'string' && /^\d{2}:\d{2}$/.test(value);
}

export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse<TimeBlock | { error: string }>> {
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Request body must be an object' }, { status: 400 });
  }

  const { name, startTime, endTime } = body as Record<string, unknown>;

  if (typeof name !== 'string' || name.trim() === '') {
    return NextResponse.json({ error: '"name" is required and cannot be empty' }, { status: 400 });
  }
  if (!isValidTime(startTime)) {
    return NextResponse.json(
      { error: '"startTime" must be a valid time in HH:MM format (e.g. "09:00")' },
      { status: 400 },
    );
  }
  if (!isValidTime(endTime)) {
    return NextResponse.json(
      { error: '"endTime" must be a valid time in HH:MM format (e.g. "11:00")' },
      { status: 400 },
    );
  }
  if (endTime <= startTime) {
    return NextResponse.json(
      { error: '"endTime" must be later than "startTime"' },
      { status: 400 },
    );
  }

  try {
    const timeBlock = await prisma.timeBlock.update({
      where: { id },
      data: { name: name.trim(), startTime, endTime },
    });
    return NextResponse.json(timeBlock);
  } catch (e) {
    if (isNotFound(e)) {
      return NextResponse.json({ error: `Time block with id "${id}" not found` }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update time block' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: Context,
): Promise<NextResponse<null | { error: string }>> {
  const { id } = await context.params;

  try {
    await prisma.timeBlock.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (isNotFound(e)) {
      return NextResponse.json({ error: `Time block with id "${id}" not found` }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete time block' }, { status: 500 });
  }
}
