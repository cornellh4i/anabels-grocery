import { NextRequest, NextResponse } from 'next/server';
import type { SwapFulfillment } from '@/types';

// TODO: GET /api/swap-fulfillments — return all fulfillments, include volunteer and swapRequest relations
export async function GET(): Promise<NextResponse<SwapFulfillment[]>> {
  return NextResponse.json([]);
}

// TODO: POST /api/swap-fulfillments — create with { swapRequestId, volunteerId, timeBlockId }
export async function POST(
  request: NextRequest,
): Promise<NextResponse<SwapFulfillment | { error: string }>> {
  void request;
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
