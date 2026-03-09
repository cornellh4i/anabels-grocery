import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { SwapFulfillment } from '@/types';

// GET /api/swap-fulfillments — return all records ordered by createdAt desc with related volunteer, swapRequest, and timeBlock
export async function GET(): Promise<NextResponse<SwapFulfillment[] | { error: string }>> {
  try {
    const fulfillments = await prisma.swapFulfillment.findMany({
      include: {
        volunteer: true,
        swapRequest: true,
        timeBlock: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(fulfillments);
  } catch (err) {
    console.error('GET /api/swap-fulfillments error:', err);
    return NextResponse.json({ error: 'Failed to fetch swap fulfillments' }, { status: 500 });
  }
}

// POST /api/swap-fulfillments — create a new record with required fields swapRequestId, volunteerId, timeBlockId
export async function POST(
  request: NextRequest,
): Promise<NextResponse<SwapFulfillment | { error: string }>> {
  try {
    const body = await request.json();
    const { swapRequestId, volunteerId, timeBlockId } = body;

    if (!swapRequestId || !volunteerId || !timeBlockId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newFulfillment = await prisma.swapFulfillment.create({
      data: { swapRequestId, volunteerId, timeBlockId },
    });

    return NextResponse.json(newFulfillment, { status: 201 });
  } catch (err) {
    console.error('POST /api/swap-fulfillments error:', err);
    return NextResponse.json({ error: 'Failed to create swap fulfillment' }, { status: 500 });
  }
}