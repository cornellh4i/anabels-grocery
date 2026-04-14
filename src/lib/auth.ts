import { NextRequest } from "next/server";
import { prisma } from "./prisma";

// TODO: replace with real Firebase Admin token verification
// import { adminAuth } from "./firebase-admin";

const MOCK_ADMIN = {
  id: "mock-admin-id",
  firebaseUid: "mock-uid",
  name: "Mock Admin",
  email: "mock@cornell.edu",
  role: "ADMIN" as const,
  createdAt: new Date(),
};

export async function verifyAuth(req: NextRequest) {
  // TODO: replace mock with real verification:
  // const authHeader = req.headers.get("Authorization");
  // if (!authHeader?.startsWith("Bearer ")) {
  //   return { user: null, error: "Missing or invalid Authorization header" };
  // }
  // const token = authHeader.split("Bearer ")[1];
  // const decoded = await adminAuth.verifyIdToken(token);
  // const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
  // if (!user) return { user: null, error: "User not found in database" };
  // return { user, error: null };

  void req;
  return { user: MOCK_ADMIN, error: null };
}

export async function verifyAdmin(req: NextRequest) {
  // TODO: replace mock with real verification — same as verifyAuth but check role === "ADMIN"
  void req;
  return { user: MOCK_ADMIN, error: null };
}