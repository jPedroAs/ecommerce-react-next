import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { User } from "@/Types/User";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/Login") {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/_next/") || req.nextUrl.pathname.startsWith("/static/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/Login", req.url));
  }

  const user: User = jwtDecode(token);

  if (req.nextUrl.pathname.startsWith("/Products") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/Catalog", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/:path*"],
};
