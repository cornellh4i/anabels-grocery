import { NextResponse } from 'next/server';
import type { User } from '@/types';

// TODO: GET /api/users — return all users ordered by createdAt
export async function GET(): Promise<NextResponse<User[]>> {
  return NextResponse.json([]);
}
