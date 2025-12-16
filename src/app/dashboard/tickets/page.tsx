// src/app/dashboard/tickets/page.tsx
"use client";

import { useState } from "react";
import {
  useTickets,
  useCreateTicket,
  useDeleteTicket,
} from "@/hooks/useTickets";
import { useDepartments } from "@/hooks/useDepartments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

export default function TicketsPage() {
  const { data = [], isLoading: ticketsLoading } = useTickets();
  const [files, setFiles] = useState<FileList | null>(null);
  const deleteTicket = useDeleteTicket();

  const tickets = Array.isArray(data) ? data : [];

  const { data: departments = [], isLoading: departmentsLoading } =
    useDepartments();

  const createTicket = useCreateTicket();
  const [open, setOpen] = useState(false);
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

    createTicket.mutate({
      title: formData.title.trim(),
      description: formData.description.trim(),
      departmentId: formData.departmentId,
      priority: formData.priority,
    });

    setOpen(false);
    setFormData({
      title: "",
      description: "",
      departmentId: "",
      priority: "medium",
    });
  };

  const getPriorityArabic = (p: string) =>
    ({ high: "عالية", medium: "متوسطة", low: "منخفضة" }[p] || p);

  const getPriorityColor = (p: string) =>
    ({
      high: "bg-red-500 text-white",
      medium: "bg-orange-500 text-white",
      low: "bg-green-500 text-white",
    }[p] || "bg-gray-500 text-white");

  if (ticketsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 p-6 pt-24">
      {/* العنوان + زر إنشاء تذكرة */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          التذاكر ({tickets.length})
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          إدارة ومتابعة جميع طلبات الدعم الفني
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl px-10 py-6 text-xl transition-all duration-300"
            >
              <Plus className="ml-3 h-7 w-7" />
              تذكرة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="text-center pb-6">
              <DialogTitle className="text-3xl font-bold text-indigo-700">
                إنشاء تذكرة جديدة
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600 mt-2">
                املأ النموذج أدناه لإرسال طلب دعم جديد
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label className="text-xl font-semibold">العنوان</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="وصف مختصر للمشكلة"
                  className="h-14 text-xl border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label className="text-xl font-semibold">القسم</Label>
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
                        <SelectItem value="loading" disabled className="py-4">
                          جاري تحميل الأقسام...
                        </SelectItem>
                      ) : departments.length === 0 ? (
                        <SelectItem value="empty" disabled className="py-4">
                          لا توجد أقسام (يجب على الـ Admin إضافة أقسام)
                        </SelectItem>
                      ) : (
                        departments.map((dept) => (
                          <SelectItem
                            key={dept._id}
                            value={dept._id}
                            className="py-4 hover:bg-indigo-100 transition-colors relative pl-10"
                          >
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 opacity-0 select-item-check text-xl">
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
                  <Label className="text-xl font-semibold">الأولوية</Label>
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
                        className="py-4 hover:bg-indigo-100 relative pl-10"
                      >
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 opacity-0 select-item-check text-xl">
                          ✓
                        </span>
                        منخفضة
                      </SelectItem>
                      <SelectItem
                        value="medium"
                        className="py-4 hover:bg-indigo-100 relative pl-10"
                      >
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 opacity-0 select-item-check text-xl">
                          ✓
                        </span>
                        متوسطة
                      </SelectItem>
                      <SelectItem
                        value="high"
                        className="py-4 hover:bg-indigo-100 relative pl-10"
                      >
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 opacity-0 select-item-check text-xl">
                          ✓
                        </span>
                        عالية
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xl font-semibold">الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={8}
                  className="text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xl font-semibold">
                  مرفقات (اختياري)
                </Label>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  className="h-14 text-lg cursor-pointer border-2 border-gray-300 rounded-xl focus:border-indigo-500"
                />
                {files && files.length > 0 && (
                  <p className="text-lg text-green-600 font-medium">
                    تم اختيار {files.length} ملف
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-6 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="px-12 text-lg border-2"
                  onClick={() => setOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="px-16 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl"
                  disabled={createTicket.isPending}
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
          </DialogContent>
        </Dialog>
      </div>

      {/* قائمة التذاكر */}
      <div className="grid gap-8">
        {tickets.length === 0 ? (
          <Card className="text-center py-24 bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl rounded-2xl">
            <CardContent>
              <p className="text-3xl font-medium text-gray-500">
                لا توجد تذاكر
              </p>
              <p className="text-xl text-gray-400 mt-6">
                ابدأ بإنشاء تذكرة جديدة من الأعلى
              </p>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket, i) => (
            <Link
              key={ticket._id || i}
              href={`/dashboard/tickets/${ticket._id}`}
              className="block group"
            >
              <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl group-hover:-translate-y-2 border-0">
                <CardContent className="p-8 relative">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors pr-16">
                      {ticket.title}
                    </h3>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-8 left-8 shadow-lg hover:shadow-xl"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (confirm("هل أنت متأكد من حذف التذكرة نهائيًا؟")) {
                          deleteTicket.mutate(ticket._id!);
                        }
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-gray-600 line-clamp-3 mb-8 text-lg leading-relaxed">
                    {ticket.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge
                      variant="secondary"
                      className="text-base px-6 py-3 rounded-full"
                    >
                      {ticket.departmentId?.name || "غير محدد"}
                    </Badge>
                    <Badge
                      className={`${getPriorityColor(
                        ticket.priority
                      )} text-base px-6 py-3 rounded-full`}
                    >
                      {getPriorityArabic(ticket.priority)}
                    </Badge>
                    <Badge
                      variant={
                        ticket.status === "pending"
                          ? "default"
                          : ticket.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-base px-6 py-3 rounded-full"
                    >
                      {ticket.status === "pending"
                        ? "معلقة"
                        : ticket.status === "in-progress"
                        ? "قيد التنفيذ"
                        : "تم الحل"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-8">
                    {new Date(ticket.createdAt).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
