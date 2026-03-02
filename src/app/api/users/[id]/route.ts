import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { User } from '@/types';

type Context = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  context: Context,
): Promise<NextResponse<User | { error: string }>> {
  try {
    const { id } = await context.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse<User | { error: string }>> {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, role } = body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
