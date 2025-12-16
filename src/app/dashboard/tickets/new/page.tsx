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
  const uploadFile = useUploadFile();
  const [files, setFiles] = useState<FileList | null>(null);
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

    if (!formData.title.trim()) return toast.error("العنوان مطلوب");
    if (!formData.description.trim()) return toast.error("الوصف مطلوب");
    if (!formData.departmentId) return toast.error("اختيار القسم مطلوب");

    let attachments: string[] = [];

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
        attachments,
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
    <div className="max-w-5xl mx-auto space-y-12 p-6 pt-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          إنشاء تذكرة جديدة
        </h1>
        <p className="text-xl text-gray-600">
          املأ النموذج لإرسال طلب دعم جديد
        </p>
      </div>

      <Card className="shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-3">
              <Label className="text-xl font-semibold">
                العنوان <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="وصف مختصر للمشكلة"
                className="h-14 text-xl"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-xl font-semibold">
                  القسم <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, departmentId: v })
                  }
                >
                  <SelectTrigger className="h-14 text-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl shadow-md hover:shadow-xl hover:border-indigo-500 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 transition-all duration-300">
                    <SelectValue
                      placeholder={
                        departmentsLoading ? "جاري تحميل..." : "اختر القسم"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-indigo-200 shadow-2xl rounded-xl">
                    {departmentsLoading ? (
                      <SelectItem value="loading" disabled>
                        جاري تحميل الأقسام...
                      </SelectItem>
                    ) : departments.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        لا توجد أقسام
                      </SelectItem>
                    ) : (
                      departments.map((dept) => (
                        <SelectItem
                          key={dept._id}
                          value={dept._id}
                          className="py-4 hover:bg-indigo-100 transition-colors"
                        >
                          <span className="mr-3 text-indigo-600 opacity-0 select-item-check text-xl">
                            ✓
                          </span>
                          {dept.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xl font-semibold">
                  الأولوية <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, priority: v })
                  }
                >
                  <SelectTrigger className="h-14 text-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl shadow-md hover:shadow-xl hover:border-indigo-500 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 transition-all duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-indigo-200 shadow-2xl rounded-xl">
                    <SelectItem
                      value="low"
                      className="py-4 hover:bg-indigo-100"
                    >
                      <span className="mr-3 text-indigo-600 opacity-0 select-item-check text-xl">
                        ✓
                      </span>
                      منخفضة
                    </SelectItem>
                    <SelectItem
                      value="medium"
                      className="py-4 hover:bg-indigo-100"
                    >
                      <span className="mr-3 text-indigo-600 opacity-0 select-item-check text-xl">
                        ✓
                      </span>
                      متوسطة
                    </SelectItem>
                    <SelectItem
                      value="high"
                      className="py-4 hover:bg-indigo-100"
                    >
                      <span className="mr-3 text-indigo-600 opacity-0 select-item-check text-xl">
                        ✓
                      </span>
                      عالية
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xl font-semibold">
                الوصف التفصيلي <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="اشرح المشكلة بالتفصيل..."
                rows={10}
                className="text-lg"
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xl font-semibold">مرفقات (اختياري)</Label>
              <Input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="cursor-pointer h-14 text-lg"
              />
              {files && files.length > 0 && (
                <p className="text-lg text-green-600 font-medium">
                  تم اختيار {files.length} ملف
                </p>
              )}
            </div>

            <div className="flex justify-end gap-6 pt-8">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push("/dashboard/tickets")}
                className="px-12 text-lg"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={createTicket.isPending}
                className="px-16 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              >
                {createTicket.isPending ? (
                  <>
                    <Loader2 className="ml-3 h-6 w-6 animate-spin" />
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
