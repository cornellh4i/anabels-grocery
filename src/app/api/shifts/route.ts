import { NextRequest, NextResponse } from 'next/server';
import type { Shift } from '@/types';

// TODO: GET /api/shifts — return all shifts ordered by date, include timeBlock and user relations
export async function GET(): Promise<NextResponse<Shift[]>> {
  return NextResponse.json([]);
}

// TODO: POST /api/shifts — create shift with { date, timeBlockId, userId }
export async function POST(
  request: NextRequest,
): Promise<NextResponse<Shift | { error: string }>> {
  void request;
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
