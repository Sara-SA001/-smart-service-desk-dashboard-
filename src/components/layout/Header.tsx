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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b">
      <div className="flex items-center justify-between px-6 py-4">
        {/* زر فتح الـ Sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium">{user?.name || "مستخدم"}</p>
              <p className="text-sm text-gray-500 capitalize">
                {user?.role || "staff"}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
