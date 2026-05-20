import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEMO_GATE_ENABLED = process.env.DEMO_GATE_ENABLED === "true";

export function middleware(request: NextRequest) {
  if (!DEMO_GATE_ENABLED) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname === "/demo-access" || pathname.startsWith("/api/demo-access")) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (request.cookies.get("demo_access")?.value === "1") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/demo-access";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
