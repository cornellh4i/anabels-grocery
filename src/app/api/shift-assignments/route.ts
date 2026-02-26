import { NextRequest, NextResponse } from 'next/server';
import type { ShiftAssignment } from '@/types';

// TODO: GET /api/shift-assignments — return all assignments, include user and shift relations
export async function GET(): Promise<NextResponse<ShiftAssignment[]>> {
  return NextResponse.json([]);
}

// TODO: POST /api/shift-assignments — create with { userId, shiftId }, enforce capacity
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ShiftAssignment | { error: string }>> {
  void request;
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
