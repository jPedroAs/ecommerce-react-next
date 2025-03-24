import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { User } from "@/Types/User";


type AuthState = {
  user: User;
  login: (token: string) => void;
  logout: () => void;
  loadUserFromCookies: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (token: string) => {
    Cookies.set("token", token, { expires: 8, secure: true, sameSite: "Strict" });
    const decoded = jwtDecode(token);
    set({ user: decoded as User });
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
