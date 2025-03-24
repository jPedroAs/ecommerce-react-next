// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(req: NextRequest) {
//     const token = req.cookies.get('token')?.value;
  
//     if (!token && req.nextUrl.pathname !== '/Login') {
//         return NextResponse.redirect(new URL('/Login', req.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/:path*']
// };

import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { User } from "@/Types/User";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/Login", req.url));
  }

  const user: User = jwtDecode(token);

  if (!user || user.role !== "admin") {
    return NextResponse.redirect(new URL("/Login", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/Produtos/:path*"],
};
