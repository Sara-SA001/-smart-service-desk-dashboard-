// src/app/dashboard/users/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash2, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  if (user?.role !== "admin") {
    router.push("/dashboard");
    return null;
  }

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data || [];
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("تم حذف المستخدم بنجاح");
    },
    onError: () => toast.error("فشل حذف المستخدم"),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.patch(`/users/${id}`, { isActive: !isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("تم تحديث حالة المستخدم");
    },
    onError: () => toast.error("فشل تحديث الحالة"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 p-6 pt-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          إدارة المستخدمين
        </h1>
        <p className="text-xl text-gray-600">
          تحكم كامل في حسابات الموظفين والمديرين
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {users.length === 0 ? (
          <Card className="col-span-full text-center py-24 bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl rounded-3xl">
            <CardContent>
              <p className="text-3xl font-medium text-gray-500">
                لا يوجد مستخدمون بعد
              </p>
              <p className="text-xl text-gray-400 mt-6">
                ابدأ بإضافة مستخدمين من صفحة التسجيل
              </p>
            </CardContent>
          </Card>
        ) : (
          users.map((u) => (
            <Card
              key={u._id}
              className="shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden"
            >
              <CardHeader
                className={`bg-gradient-to-r ${
                  u.role === "admin"
                    ? "from-purple-500 to-purple-600"
                    : "from-indigo-500 to-indigo-600"
                } text-white p-8`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {u.name}
                    </CardTitle>
                    <p className="text-lg opacity-90">{u.email}</p>
                  </div>
                  <Badge className="text-lg px-5 py-2 rounded-full bg-white/30">
                    {u.role === "admin" ? "مدير" : "موظف"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex justify-center">
                  <Badge
                    variant={u.isActive ? "default" : "destructive"}
                    className="text-lg px-8 py-4 rounded-full shadow-lg"
                  >
                    {u.isActive ? (
                      <>
                        <UserCheck className="ml-2 h-6 w-6" />
                        نشط
                      </>
                    ) : (
                      <>
                        <UserX className="ml-2 h-6 w-6" />
                        معطل
                      </>
                    )}
                  </Badge>
                </div>

                <p className="text-center text-gray-600">
                  انضم في: {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                </p>

                <div className="flex gap-3 mt-8">
                  <Button
                    size="sm"
                    variant={u.isActive ? "destructive" : "default"}
                    className="flex-1 "
                    onClick={() =>
                      toggleActive.mutate({ id: u._id, isActive: u.isActive })
                    }
                  >
                    {u.isActive ? (
                      <>
                        <UserX className="h-4 w-4 " />
                        تعطيل الحساب
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 ml-2" />
                        تفعيل الحساب
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      if (
                        confirm("هل أنت متأكد من حذف هذا المستخدم نهائيًا؟")
                      ) {
                        deleteUser.mutate(u._id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
