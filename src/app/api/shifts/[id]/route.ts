import { NextRequest, NextResponse } from 'next/server';
import type { Shift } from '@/types';

type Context = { params: Promise<{ id: string }> };

// TODO: PUT /api/shifts/[id] — update date, timeBlockId, committee, or capacity
export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse<Shift | { error: string }>> {
  void (await context.params);
  void request;
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

// TODO: DELETE /api/shifts/[id] — delete shift, 404 if not found
export async function DELETE(
  _request: NextRequest,
  context: Context,
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  void (await context.params);
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
