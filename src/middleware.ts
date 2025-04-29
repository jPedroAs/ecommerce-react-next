import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { User } from "@/Types/User";

export function middleware(req: NextRequest) {
  // Permite acesso direto à página /Login
  if (req.nextUrl.pathname === "/Login") {
    return NextResponse.next();
  }

  // Permite acesso direto à página /ForgotPassword
  if (req.nextUrl.pathname === "/ForgotPassword") { // Adicione esta condição
    return NextResponse.next();
  }

  // Permite acesso a arquivos internos do Next.js e arquivos estáticos
  if (req.nextUrl.pathname.startsWith("/_next/") || req.nextUrl.pathname.startsWith("/static/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // Se não houver token, redirecione para a página /Login
  if (!token) {
    return NextResponse.redirect(new URL("/Login", req.url));
  }

  const user: User = jwtDecode(token);

  // Se a rota começar com /Products e o usuário não for um admin, redireciona para /Home
  if (req.nextUrl.pathname.startsWith("/Products") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/Home", req.url));
  }

  // Em outros casos (com token válido), permite o acesso
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};