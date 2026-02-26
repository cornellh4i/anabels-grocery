import { NextRequest, NextResponse } from 'next/server';
import type { Attendance } from '@/types';

type Context = { params: Promise<{ id: string }> };

// TODO: PUT /api/attendance/[id] — update status, notes, or markedBy; 404 if not found
export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse<Attendance | { error: string }>> {
  void (await context.params);
  void request;
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
