import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Attendance } from '@/types';

// GET /api/attendance — return all records ordered by createdAt desc, include user and shift relations
export async function GET(): Promise<NextResponse<Attendance[] | { error: string }>> {
  try {
    const attendanceRecords = await prisma.attendance.findMany({
      include: {
        user: true,
        shift: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(attendanceRecords);
  } catch (err) {
    console.error('GET /api/attendance error:', err);
    return NextResponse.json({ error: 'Failed to fetch attendance records' }, { status: 500 });
  }
}

// POST /api/attendance — create record with required fields { userId, shiftId, status } and optional notes, markedBy
export async function POST(request: NextRequest): Promise<NextResponse<Attendance | { error: string }>> {
  try {
    const body = await request.json();
    const { userId, shiftId, status, notes, markedBy } = body;

    if (!userId || !shiftId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newRecord = await prisma.attendance.create({
      data: { userId, shiftId, status, notes, markedBy },
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (err) {
    console.error('POST /api/attendance error:', err);
    return NextResponse.json({ error: 'Failed to create attendance record' }, { status: 500 });
  }
}