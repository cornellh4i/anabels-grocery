import { NextRequest, NextResponse } from 'next/server';
import type { SwapRequest } from '@/types';

// TODO: GET /api/swap-requests — return all requests ordered by createdAt desc, include relations
export async function GET(): Promise<NextResponse<SwapRequest[]>> {
  return NextResponse.json([]);
}

// TODO: POST /api/swap-requests — create with { requesterId, shiftId, timeBlockId, reason? }
export async function POST(
  request: NextRequest,
): Promise<NextResponse<SwapRequest | { error: string }>> {
  void request;
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
