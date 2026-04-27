import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { adminAuth } from "./firebase-admin";

export async function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null, error: "Missing or invalid Authorization header" };
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    return { user: null, error: "Missing or invalid Authorization header" };
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user) {
      return { user: null, error: "User not found in database" };
    }

    return { user, error: null };
  } catch {
    return { user: null, error: "Invalid or expired token" };
  }
}

export async function verifyAdmin(req: NextRequest) {
  const { user, error } = await verifyAuth(req);

  if (error || !user) {
    return { user: null, error: error ?? "Invalid or expired token" };
  }

  if (user.role !== "ADMIN") {
    return { user: null, error: "Admin access required" };
  }

  return { user, error: null };
}