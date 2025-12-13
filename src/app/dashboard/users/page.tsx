// src/app/dashboard/users/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash2, UserX } from "lucide-react";
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
      toast.success("تم حذف المستخدم");
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.patch(`/users/${id}`, { isActive: !isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("تم تحديث حالة المستخدم");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 pt-24">
      <h1 className="text-4xl font-bold">إدارة المستخدمين</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <Card key={u._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{u.name}</CardTitle>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>
                <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                  {u.role === "admin" ? "مدير" : "موظف"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={u.isActive ? "default" : "destructive"}>
                  {u.isActive ? "نشط" : "معطل"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toggleActive.mutate({ id: u._id, isActive: u.isActive })
                  }
                >
                  <UserX className="h-4 w-4 ml-1" />
                  {u.isActive ? "تعطيل" : "تفعيل"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteUser.mutate(u._id)}
                >
                  <Trash2 className="h-4 w-4 ml-1" />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
