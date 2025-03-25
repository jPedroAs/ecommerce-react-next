import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { User } from "@/Types/User";
import { NextResponse } from "next/server";


type AuthState = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loadUserFromCookies: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (token: string) => {
    Cookies.set("token", token, {
      path: "/",
      secure: true,
      sameSite: "strict",
      expires: 1,
    });
    const response = new NextResponse();

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    const decoded = jwtDecode<User>(token);
    console.log("Usuário decodificado:", decoded);
    set(() => ({ user: decoded }));

  },

  logout: () => {
    Cookies.remove("token");
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
