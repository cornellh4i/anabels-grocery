import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import type { SwapRequest } from '@/types';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse<SwapRequest[] | { error: string }>> {
  try {
    const requests = await prisma.swapRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
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
        fulfillments: {
          include: {
            volunteer: true,
          },
        },
      },
    });
    return NextResponse.json(requests, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to get swap requests' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<SwapRequest | { error: string }>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }

  try {
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json(
        { error: 'Request body must be an object' },
        { status: 400 },
      );
    }

    const { shiftAssignmentId, reason } = body as Record<string, unknown>;

    if (typeof shiftAssignmentId !== 'string' || shiftAssignmentId.trim() === '') {
      return NextResponse.json(
        { error: '"shiftAssignmentId" is required and cannot be empty' },
        { status: 400 },
      );
    }

    const newRequest = await prisma.swapRequest.create({
      data: {
        shiftAssignmentId,
        reason: typeof reason === 'string' ? reason : undefined,
      },
    });
    return NextResponse.json(newRequest, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${e.message}` },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: 'Failed to create swap request' },
      { status: 500 },
    );
  }
}
