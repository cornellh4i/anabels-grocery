import { NextRequest, NextResponse } from 'next/server';
import type { SwapRequest } from '@/types';

type Context = { params: Promise<{ id: string }> };

// TODO: PUT /api/swap-requests/[id] — update status or reason, 404 if not found
export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse<SwapRequest | { error: string }>> {
  void (await context.params);
  void request;
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
