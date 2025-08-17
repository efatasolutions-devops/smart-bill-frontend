import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl?.pathname;

  const isAuthPage = ["/login", "/register"]?.includes(pathname);

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/beranda", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|\\.well-known).*)"],
};
