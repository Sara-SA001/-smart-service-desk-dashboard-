"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
    }
  }, [user, token, router]);

  if (!user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الـ Header مع زر فتح الـ Sidebar */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* الـ Sidebar (مخفي افتراضيًا ويطلع من اليمين) */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* المحتوى الرئيسي */}
      <main
        className={`transition-all duration-300  lex-1 overflow-y-auto bg-gray-50 pt-20 ${
          sidebarOpen ? "mr-64" : "mr-0"
        }`}
      >
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
