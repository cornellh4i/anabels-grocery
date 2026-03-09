import { NextRequest, NextResponse } from 'next/server';
import type { SwapFulfillment } from '@/types';

type Context = { params: Promise<{ id: string }> };

export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse<SwapFulfillment | { error: string }>> {
  void (await context.params);
  void request;
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

