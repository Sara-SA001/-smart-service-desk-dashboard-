// Header.tsx
"use client";

import { useAuthStore } from "@/stores/authStore";
import { Bell, Menu } from "lucide-react";

export default function Header({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const { user } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-2xl">
      <div className="flex items-center justify-between px-8 py-5">
        {/* زر فتح الـ Sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
        >
          <Menu className="h-7 w-7 text-white" />
        </button>

        <div className="flex items-center gap-6">
          <button className="relative p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm">
            <Bell className="w-6 h-6 text-white" />
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
            <div className="text-right">
              <p className="font-bold text-xl text-white">
                {user?.name || "مستخدم"}
              </p>
              <p className="text-sm text-white/80 capitalize">
                {user?.role === "admin" ? "مدير النظام" : "موظف"}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-700 shadow-xl">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
