// src/app/dashboard/departments/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

interface Department {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export default function DepartmentsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // جلب الأقسام
  const { data: departments = [], isLoading } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await api.get("/departments");
      return res.data || [];
    },
  });

  // إضافة قسم
  const addDepartment = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await api.post("/departments/", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("تم إضافة القسم بنجاح");
      setOpenAdd(false);
      setFormData({ name: "", description: "" });
    },
    onError: () => toast.error("فشل إضافة القسم"),
  });

  // تعديل قسم
  const updateDepartment = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; description?: string };
    }) => {
      const res = await api.patch(`/departments/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("تم تعديل القسم بنجاح");
      setOpenEdit(false);
      setEditingDept(null);
      setFormData({ name: "", description: "" });
    },
    onError: () => toast.error("فشل تعديل القسم"),
  });

  // حذف قسم
  const deleteDepartment = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/departments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("تم حذف القسم بنجاح");
    },
    onError: () => toast.error("فشل حذف القسم"),
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("اسم القسم مطلوب");
    addDepartment.mutate(formData);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept || !formData.name.trim())
      return toast.error("اسم القسم مطلوب");
    updateDepartment.mutate({ id: editingDept._id, data: formData });
  };

  const startEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, description: dept.description || "" });
    setOpenEdit(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 pt-24">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">إدارة الأقسام</h1>
        {user?.role === "admin" && (
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="ml-2 h-5 w-5" />
                إضافة قسم جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة قسم جديد</DialogTitle>
                <DialogDescription>
                  املأ النموذج لإضافة قسم جديد إلى النظام
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Label>اسم القسم</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="مثال: تكنولوجيا المعلومات"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>الوصف (اختياري)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="وصف مختصر للقسم"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenAdd(false)}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={addDepartment.isPending}>
                    {addDepartment.isPending ? "جاري..." : "إضافة"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <CardContent>
              <p className="text-xl text-gray-500">لا توجد أقسام بعد</p>
              {user?.role === "admin" && (
                <p className="text-gray-400 mt-2">ابدأ بإضافة قسم جديد</p>
              )}
            </CardContent>
          </Card>
        ) : (
          departments.map((dept) => (
            <Card key={dept._id} className="relative">
              <CardHeader>
                <CardTitle className="text-xl">{dept.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {dept.description ? (
                  <p className="text-gray-600">{dept.description}</p>
                ) : (
                  <p className="text-gray-400 italic">لا يوجد وصف</p>
                )}
                <p className="text-sm text-gray-500 mt-4">
                  تم الإنشاء في:{" "}
                  {new Date(dept.createdAt).toLocaleDateString("ar-EG")}
                </p>

                {user?.role === "admin" && (
                  <div className="flex gap-2 mt-6">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(dept)}
                    >
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteDepartment.mutate(dept._id)}
                      disabled={deleteDepartment.isPending}
                    >
                      <Trash2 className="h-4 w-4 ml-1" />
                      حذف
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog التعديل */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل القسم</DialogTitle>
            <DialogDescription>قم بتعديل بيانات القسم</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label>اسم القسم</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>الوصف (اختياري)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenEdit(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={updateDepartment.isPending}>
                {updateDepartment.isPending ? "جاري..." : "حفظ التعديلات"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
