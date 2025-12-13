"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query"; // أضفنا useQueryClient
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
import { useTickets } from "@/hooks/useTickets"; // ← استخدم نفس الـ hook

export default function Dashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient(); // لتحديث البيانات يدويًا
  const { data: tickets = [], isLoading } = useTickets();
  // استعلام التذاكر (نفس الـ key بتاع صفحة التذاكر عشان يتحدث معاها)
  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ["tickets"], // مهم جدًا: نفس الـ key في useTickets
    queryFn: async () => {
      const { data } = await api.get("/tickets", {
        params: { limit: 1000, status: "all" }, // نجيب عدد كبير جدًا
      });
      console.log(data);

      return {
        list: Array.isArray(data.data) ? data.data : [],
        total:
          data.meta?.pagination?.total || data.total || data.data?.length || 0,
        pending: data.summary?.status?.pending || 0,
        inProgress: data.summary?.status?.["in-progress"] || 0,
        resolved: data.summary?.status?.resolved || 0,
      };
    },
  });

  // استعلام المستخدمين والأقسام
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

  // الإحصائيات
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
    <div className="max-w-7xl mx-auto space-y-12 py-8">
      {/* الترحيب */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          مرحبًا، {user?.name || "المستخدم"}!
        </h1>
        <p className="text-xl text-gray-600">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي التذاكر"
          value={stats.totalTickets}
          icon={<Ticket className="h-8 w-8" />}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="قيد الانتظار"
          value={stats.pending}
          icon={<AlertCircle className="h-8 w-8" />}
          color="from-yellow-500 to-amber-600"
        />
        <StatCard
          title="قيد المعالجة"
          value={stats.inProgress}
          icon={<Clock className="h-8 w-8" />}
          color="from-orange-500 to-red-600"
        />
        <StatCard
          title="تم الحل"
          value={stats.resolved}
          icon={<CheckCircle2 className="h-8 w-8" />}
          color="from-green-500 to-emerald-600"
        />

        {user?.role === "admin" && (
          <>
            <StatCard
              title="عدد المستخدمين"
              value={stats.totalUsers}
              icon={<Users className="h-8 w-8" />}
              color="from-purple-500 to-purple-600"
            />
            <StatCard
              title="عدد الأقسام"
              value={stats.totalDepartments}
              icon={<Building2 className="h-8 w-8" />}
              color="from-indigo-500 to-indigo-600"
            />
          </>
        )}
      </div>

      {/* أزرار التنقل */}
      <div className="text-center space-y-8">
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/dashboard/tickets">
            <Button size="lg" className="text-lg px-12 py-8 shadow-xl">
              <Ticket className="h-7 w-7 ml-3" />
              عرض جميع التذاكر
            </Button>
          </Link>

          <Link href="/dashboard/tickets/new">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-12 py-8 border-2 shadow-xl"
            >
              <Plus className="h-7 w-7 ml-3" />
              إنشاء تذكرة جديدة
            </Button>
          </Link>
        </div>
      </div>

      <footer className="text-center text-gray-500 text-sm pt-20">
        © 2025 Smart Service Desk • جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

// مكون البطاقة الإحصائية
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
    <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <CardHeader
        className={`bg-gradient-to-r ${color} text-white rounded-t-lg`}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="opacity-90">{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-8 pb-6 text-center">
        <p className="text-5xl font-bold text-gray-800">
          {value.toLocaleString("en-ua")}
        </p>
      </CardContent>
    </Card>
  );
}
