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

  const { data: departments = [], isLoading } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await api.get("/departments");
      return res.data || [];
    },
  });

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
  });

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
  });

  const deleteDepartment = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/departments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("تم حذف القسم بنجاح");
    },
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
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 p-6 pt-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">إدارة الأقسام</h1>
        <p className="text-xl text-gray-600">
          أضف، عدّل، أو احذف الأقسام في النظام
        </p>
      </div>

      {user?.role === "admin" && (
        <div className="text-center">
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              >
                <Plus className="ml-2 h-6 w-6" />
                إضافة قسم جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-2xl">إضافة قسم جديد</DialogTitle>
                <DialogDescription>
                  املأ النموذج لإضافة قسم جديد إلى النظام
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium">اسم القسم</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="مثال: تكنولوجيا المعلومات"
                    className="h-12 text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    الوصف (اختياري)
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="وصف مختصر للقسم"
                    rows={4}
                    className="text-base"
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
                    {addDepartment.isPending ? "جاري..." : "إضافة القسم"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {departments.length === 0 ? (
          <Card className="col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent>
              <p className="text-2xl text-gray-500 font-medium">
                لا توجد أقسام بعد
              </p>
              {user?.role === "admin" && (
                <p className="text-gray-400 mt-4 text-lg">
                  ابدأ بإضافة قسم جديد من الأعلى
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          departments.map((dept) => (
            <Card
              key={dept._id}
              className="hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm"
            >
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl">
                <CardTitle className="text-2xl text-indigo-800">
                  {dept.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {dept.description ? (
                  <p className="text-gray-700 leading-relaxed">
                    {dept.description}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">لا يوجد وصف</p>
                )}
                <p className="text-sm text-gray-500 mt-6">
                  تم الإنشاء في:{" "}
                  {new Date(dept.createdAt).toLocaleDateString("ar-EG")}
                </p>

                {user?.role === "admin" && (
                  <div className="flex gap-3 mt-8 ">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1 "
                      onClick={() => startEdit(dept)}
                    >
                      <Edit className="h-4 w-4 ml-2 " />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1 "
                      onClick={() => deleteDepartment.mutate(dept._id)}
                      disabled={deleteDepartment.isPending}
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
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
        <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl">تعديل القسم</DialogTitle>
            <DialogDescription>قم بتعديل بيانات القسم</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">اسم القسم</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-medium">الوصف (اختياري)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="text-base"
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
