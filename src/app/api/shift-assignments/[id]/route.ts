import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type Context = { params: Promise<{ id: string }> };

function isNotFound(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025';
}

export async function DELETE(
  _request: NextRequest,
  context: Context,
): Promise<NextResponse<null | { error: string }>> {
  const { id } = await context.params;

  try {
    await prisma.shiftAssignment.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (isNotFound(e)) {
      return NextResponse.json(
        { error: `Shift assignment with id "${id}" not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete shift assignment' },
      { status: 500 },
    );
  }
}

