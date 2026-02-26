import { NextRequest, NextResponse } from 'next/server';
import type { Attendance } from '@/types';

// TODO: GET /api/attendance — return all records ordered by createdAt desc, include user and shift relations
export async function GET(): Promise<NextResponse<Attendance[]>> {
  return NextResponse.json([]);
}

// TODO: POST /api/attendance — create with { userId, shiftId, status?, notes?, markedBy? }
export async function POST(
  request: NextRequest,
): Promise<NextResponse<Attendance | { error: string }>> {
  void request;
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
