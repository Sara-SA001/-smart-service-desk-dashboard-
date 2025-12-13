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
import { Plus, Loader2 } from "lucide-react";
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
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* العنوان + زر إنشاء تذكرة */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">التذاكر ({tickets.length})</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="ml-2" />
              تذكرة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>إنشاء تذكرة جديدة</DialogTitle>
              <DialogDescription>
                املأ النموذج أدناه لإنشاء تذكرة دعم جديدة.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>العنوان</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>القسم</Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(v) =>
                      setFormData({ ...formData, departmentId: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          departmentsLoading ? "جاري تحميل..." : "اختر القسم"
                        }
                      />
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
                  <Label>الأولوية</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v: any) =>
                      setFormData({ ...formData, priority: v })
                    }
                  >
                    <SelectTrigger>
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

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
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

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={createTicket.isPending}>
                  {createTicket.isPending ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
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
      <div className="grid gap-6">
        {tickets.length === 0 ? (
          <Card className="text-center py-20">
            <CardContent>
              <p className="text-2xl text-gray-500">لا توجد تذاكر</p>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket, i) => (
            <Link
              key={ticket._id || i}
              href={`/dashboard/tickets/${ticket._id}`}
              className="block"
            >
              <Card
                className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-l-4"
                style={{
                  borderLeftColor:
                    ticket.priority === "high"
                      ? "#ef4444"
                      : ticket.priority === "medium"
                      ? "#f97316"
                      : "#22c55e",
                }}
              >
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold">{ticket.title}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (confirm("هل أنت متأكد من حذف التذكرة؟")) {
                        deleteTicket.mutate(ticket._id!);
                      }
                    }}
                  >
                    حذف
                  </Button>
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Badge variant="secondary">
                      {ticket.departmentId?.name || "غير محدد"}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
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
                    >
                      {ticket.status === "pending"
                        ? "معلقة"
                        : ticket.status === "in-progress"
                        ? "قيد التنفيذ"
                        : "تم الحل"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(ticket.createdAt).toLocaleString("en-ua")}
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
