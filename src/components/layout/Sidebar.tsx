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
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-blue-600">Smart Desk</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== "admin") return null;

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </>
  );
}
