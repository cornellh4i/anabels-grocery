import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { TimeBlock } from '@/types';

/** Checks that the value is a string in HH:MM format. */
function isValidTime(value: unknown): value is string {
  return typeof value === 'string' && /^\d{2}:\d{2}$/.test(value);
}

export async function GET(): Promise<NextResponse<TimeBlock[] | { error: string }>> {
  try {
    const timeBlocks = await prisma.timeBlock.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(timeBlocks);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch time blocks' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<TimeBlock | { error: string }>> {
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
    const timeBlock = await prisma.timeBlock.create({
      data: { name: name.trim(), startTime, endTime },
    });
    return NextResponse.json(timeBlock, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: `Database error: ${e.message}` }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create time block' }, { status: 500 });
  }
}
