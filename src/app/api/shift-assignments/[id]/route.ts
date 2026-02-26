import { NextRequest, NextResponse } from 'next/server';

type Context = { params: Promise<{ id: string }> };

// TODO: DELETE /api/shift-assignments/[id] — remove assignment, 404 if not found
export async function DELETE(
  _request: NextRequest,
  context: Context,
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  void (await context.params);
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
