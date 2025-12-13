// src/stores/authStore.ts
import { create } from "zustand";
import Cookies from "js-cookie";

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "staff";
  createdAt?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get("token") || null,
  isLoading: false,

  login: (user, token) => {
    Cookies.set("token", token, { expires: 7 });
    set({ user, token, isLoading: false });
  },

  logout: () => {
    Cookies.remove("token");
    set({ user: null, token: null });
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));