// src/app/dashboard/tickets/new/page.tsx
"use client";

import { useState } from "react";
import { useCreateTicket, useUploadFile } from "@/hooks/useTickets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDepartments } from "@/hooks/useDepartments";
export default function NewTicketPage() {
  const router = useRouter();
  const createTicket = useCreateTicket();
  const [files, setFiles] = useState<FileList | null>(null);
  const uploadFile = useUploadFile();
  const { data: departments = [], isLoading: departmentsLoading } =
    useDepartments();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    departmentId: "",
    priority: "medium" as "low" | "medium" | "high",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من الحقول
    if (!formData.title.trim()) return toast.error("العنوان مطلوب");
    if (!formData.description.trim()) return toast.error("الوصف مطلوب");
    if (!formData.departmentId) return toast.error("اختيار القسم مطلوب");

    let attachments: string[] = [];

    // رفع الملفات إن وجدت
    if (files && files.length > 0) {
      toast.loading("جاري رفع الملفات...", { id: "upload" });

      try {
        const uploadPromises = Array.from(files).map((file) =>
          uploadFile.mutateAsync(file)
        );
        const results = await Promise.all(uploadPromises);
        attachments = results.map((r) => r.url);

        toast.dismiss("upload");
        toast.success(`تم رفع ${files.length} ملف بنجاح`);
      } catch {
        toast.dismiss("upload");
        return toast.error("فشل رفع الملفات");
      }
    }

    createTicket.mutate(
      {
        title: formData.title.trim(),
        description: formData.description.trim(),
        departmentId: formData.departmentId,
        priority: formData.priority,
        attachments, // أضف ده
      },
      {
        onSuccess: () => {
          toast.success("تم إنشاء التذكرة بنجاح!");
          router.push("/dashboard/tickets");
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-24">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">إنشاء تذكرة جديدة</h1>
        <p className="text-lg text-gray-600 mt-2">
          املأ النموذج أدناه لإرسال طلب دعم جديد
        </p>
      </div>

      <Card className="shadow-xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* العنوان */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-semibold">
                العنوان <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="وصف مختصر للمشكلة"
                className="text-lg"
                required
              />
            </div>

            {/* القسم والأولوية */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-lg font-semibold">
                  القسم <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, departmentId: v })
                  }
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentsLoading ? (
                      <SelectItem value="loading" disabled>
                        جاري تحميل الأقسام...
                      </SelectItem>
                    ) : departments.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        لا توجد أقسام (يجب على الـ Admin إضافة أقسام)
                      </SelectItem>
                    ) : (
                      departments.map((dept) => (
                        <SelectItem key={dept._id} value={dept._id}>
                          {dept.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-lg font-semibold">
                  الأولوية <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, priority: v })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">منخفضة</SelectItem>
                    <SelectItem value="medium">متوسطة</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* الوصف */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-semibold">
                الوصف التفصيلي <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="اشرح المشكلة بالتفصيل... كلما كان الوصف أوضح، كلما تم الحل أسرع"
                rows={8}
                className="text-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>مرفقات (اختياري)</Label>
              <Input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="cursor-pointer"
              />
              {files && files.length > 0 && (
                <p className="text-sm text-green-600">
                  تم اختيار {files.length} ملف
                </p>
              )}
            </div>

            {/* الأزرار */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push("/dashboard/tickets")}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={createTicket.isPending}
                className="min-w-40"
              >
                {createTicket.isPending ? (
                  <>
                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  "إرسال التذكرة"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
