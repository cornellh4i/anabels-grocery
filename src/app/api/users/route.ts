import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuth } from '@/lib/firebase-admin';
import type { User } from '@/types';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<User[] | { error: string }>> {
  const { searchParams } = new URL(request.url);
  const firebaseUid = searchParams.get('firebaseUid') ?? undefined;

  try {
    const users = await prisma.user.findMany({
      where: firebaseUid ? { firebaseUid } : undefined,
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<User | { error: string }>> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const body = (await request.json()) as { name: string; email: string };

    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {},
      create: {
        firebaseUid: decoded.uid,
        name: body.name,
        email: body.email,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
