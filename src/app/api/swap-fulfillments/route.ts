import { NextRequest, NextResponse } from 'next/server';
import { Prisma, SwapStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { SwapFulfillment } from '@/types';

export async function GET(): Promise<NextResponse<SwapFulfillment[] | { error: string }>> {
  try {
    const fulfillments = await prisma.swapFulfillment.findMany({
      include: {
        volunteer: true,
        swapRequest: {
          include: {
            shiftAssignment: {
              include: {
                user: true,
                shift: {
                  include: {
                    timeBlock: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(fulfillments);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch swap fulfillments' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<SwapFulfillment | { error: string }>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { error: 'Request body must be an object' },
      { status: 400 },
    );
  }

  const { swapRequestId, volunteerId } = body as Record<string, unknown>;

  if (typeof swapRequestId !== 'string' || swapRequestId.trim() === '') {
    return NextResponse.json(
      { error: '"swapRequestId" is required and cannot be empty' },
      { status: 400 },
    );
  }

  if (typeof volunteerId !== 'string' || volunteerId.trim() === '') {
    return NextResponse.json(
      { error: '"volunteerId" is required and cannot be empty' },
      { status: 400 },
    );
  }

  try {
    const fulfillment = await prisma.$transaction(async (tx) => {
      const created = await tx.swapFulfillment.create({
        data: {
          swapRequestId,
          volunteerId,
        },
      });

      await tx.swapRequest.update({
        where: { id: swapRequestId },
        data: {
          status: SwapStatus.FILLED,
        },
      });

      return created;
    });

    return NextResponse.json(fulfillment, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${e.message}` },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create swap fulfillment' },
      { status: 500 },
    );
  }
}
