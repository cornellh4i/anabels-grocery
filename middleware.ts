import { NextRequest, NextResponse } from "next/server";

// TODO: protect /volunteer and /admin routes
// TODO: redirect unauthenticated users to /login
// For now just pass through — real token check comes after backend auth is done

export function middleware(request: NextRequest) {
  // TODO: check for Authorization token in cookies or headers
  // TODO: redirect to /login if not authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/volunteer/:path*", "/admin/:path*"],
};