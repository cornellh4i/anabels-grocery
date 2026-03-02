import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { User } from '@/types';

export async function GET(): Promise<NextResponse<User[] | { error: string }>> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
