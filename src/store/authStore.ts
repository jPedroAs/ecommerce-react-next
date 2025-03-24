import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { User } from "@/Types/User";
import { NextResponse } from "next/server";


type AuthState = {
  user: User  | null;
  login: (token: string) => void;
  logout: () => void;
  loadUserFromCookies: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (token: string) => {
    document.cookie = `token=${token}; Path=/; Secure; SameSite=Strict; Max-Age=${60 * 60 * 8}`;
    const response = new NextResponse();

    response.cookies.set("token", token, {
      httpOnly: true, 
      sameSite: "strict", 
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    try {
      const decoded = jwtDecode<User>(token);
      console.log("Usuário decodificado:", decoded);
      set(() => ({ user: decoded }));
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
    }
    
  },

  logout: () => {
    document.cookie = "token=; Path=/; Max-Age=0"; 
    set({ user: null });
  },

  loadUserFromCookies: () => {
    const token = Cookies.get("token");
    if (token) {
      const decoded = jwtDecode(token);
      set({ user: decoded as User });
    }
  },
}));
