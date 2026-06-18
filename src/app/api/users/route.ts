import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@/types";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: NextRequest): Promise<NextResponse<User[] | { error: string }>> {
  const { user, error } = await verifyAdmin(req);
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
