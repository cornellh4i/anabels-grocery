import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/volunteer", request.url));
  }

  if (!isLoginPage && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/volunteer/:path*", "/admin/:path*", "/login"],
};
