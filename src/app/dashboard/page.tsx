// src/app/dashboard/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Ticket,
  Users,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { useTickets } from "@/hooks/useTickets";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { data: tickets = [], isLoading: ticketsLoading } = useTickets();

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: user?.role === "admin",
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await api.get("/departments");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const stats = {
    totalTickets: tickets.length,
    pending: tickets.filter((t) => t.status === "pending").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    totalUsers: users.length,
    totalDepartments: departments.length,
  };

  if (ticketsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto space-y-16 px-6">
        {/* الترحيب */}
        <div className="text-center bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            مرحبًا، {user?.name || "المستخدم"}!
          </h1>
          <p className="text-2xl text-gray-700">
            {user?.role === "admin" ? "مدير النظام" : "موظف دعم"} •{" "}
            {new Date().toLocaleDateString("en-ua", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <StatCard
            title="إجمالي التذاكر"
            value={stats.totalTickets}
            icon={<Ticket className="h-12 w-12" />}
            color="from-indigo-500 to-indigo-600"
          />
          <StatCard
            title="قيد الانتظار"
            value={stats.pending}
            icon={<AlertCircle className="h-12 w-12" />}
            color="from-yellow-500 to-amber-600"
          />
          <StatCard
            title="قيد المعالجة"
            value={stats.inProgress}
            icon={<Clock className="h-12 w-12" />}
            color="from-orange-500 to-red-600"
          />
          <StatCard
            title="تم الحل"
            value={stats.resolved}
            icon={<CheckCircle2 className="h-12 w-12" />}
            color="from-green-500 to-emerald-600"
          />

          {user?.role === "admin" && (
            <>
              <StatCard
                title="عدد المستخدمين"
                value={stats.totalUsers}
                icon={<Users className="h-12 w-12" />}
                color="from-purple-500 to-purple-600"
              />
              <StatCard
                title="عدد الأقسام"
                value={stats.totalDepartments}
                icon={<Building2 className="h-12 w-12" />}
                color="from-pink-500 to-pink-600"
              />
            </>
          )}
        </div>

        {/* أزرار التنقل */}
        <div className="text-center space-y-10">
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link href="/dashboard/tickets">
              <Button
                size="lg"
                className="px-16 py-8 text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <Ticket className="h-10 w-10 ml-4" />
                عرض جميع التذاكر
              </Button>
            </Link>

            <Link href="/dashboard/tickets/new">
              <Button
                size="lg"
                variant="outline"
                className="px-16 py-8 text-2xl border-4 border-indigo-600 hover:bg-indigo-50 shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <Plus className="h-10 w-10 ml-4" />
                إنشاء تذكرة جديدة
              </Button>
            </Link>
          </div>
        </div>

        <footer className="text-center text-gray-600 text-lg pt-20">
          © 2025 Smart Service Desk • جميع الحقوق محفوظة
        </footer>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
      <CardHeader className={`bg-gradient-to-r ${color} text-white p-8`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <div className="opacity-90">{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-12 pb-10 text-center">
        <p className="text-6xl font-extrabold text-gray-800">
          {value.toLocaleString("en-ua")}
        </p>
      </CardContent>
    </Card>
  );
}
