import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@/types';

type Context = { params: Promise<{ id: string }> };

// TODO: GET /api/users/[id] — return user by id, 404 if not found
export async function GET(
  _request: NextRequest,
  context: Context,
): Promise<NextResponse<User | { error: string }>> {
  void (await context.params);
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

// TODO: PUT /api/users/[id] — update name, role, or committee
export async function PUT(
  request: NextRequest,
  context: Context,
): Promise<NextResponse<User | { error: string }>> {
  void (await context.params);
  void request;
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
