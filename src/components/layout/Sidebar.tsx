// Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Home, Ticket, Users, LogOut, Building2, X } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "الرئيسية", icon: Home },
  { href: "/dashboard/tickets", label: "التذاكر", icon: Ticket },
  {
    href: "/dashboard/departments",
    label: "الأقسام",
    icon: Building2,
    adminOnly: true,
  },
  {
    href: "/dashboard/users",
    label: "المستخدمين",
    icon: Users,
    adminOnly: true,
  },
];

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-gradient-to-b from-indigo-700 to-purple-800 shadow-2xl transform transition-transform duration-500 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between p-8 border-b border-white/20">
          <h2 className="text-3xl font-bold text-white">Smart Desk</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all"
          >
            <X className="h-7 w-7 text-white" />
          </button>
        </div>

        <nav className="p-6 space-y-4">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== "admin") return null;

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-300 text-lg font-medium
                  ${
                    isActive
                      ? "bg-white/20 text-white shadow-xl backdrop-blur-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <item.icon className="w-7 h-7" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-white/20">
          <button
            onClick={logout}
            className="flex items-center gap-5 px-6 py-5 rounded-2xl bg-red-600/80 hover:bg-red-600 text-white w-full transition-all duration-300 text-lg font-medium shadow-xl"
          >
            <LogOut className="w-7 h-7" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </>
  );
}
