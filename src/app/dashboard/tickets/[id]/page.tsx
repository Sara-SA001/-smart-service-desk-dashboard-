"use client";

import { use, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  useTicketComments,
  useAddComment,
  useUpdateTicket,
} from "@/hooks/useTickets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/authStore";
import { Loader2, ArrowLeft, Paperclip, Calendar, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  departmentId: { _id: string; name: string };
  user: { _id: string; name: string; email: string };
  attachments?: Array<{ url: string; originalName: string }>;
}

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user: currentUser } = useAuthStore();
  const updateTicket = useUpdateTicket();

  /* ================== جلب التذكرة ================== */
  const { data: ticket, isLoading } = useQuery<Ticket>({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const res = await api.get(`/tickets/${id}`);
      return res.data;
    },
  });

  /* ================== Edit Mode ================== */
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (ticket) {
      setEditData({
        title: ticket.title,
        description: ticket.description,
      });
    }
  }, [ticket]);

  /* ================== التعليقات ================== */
  const { data: comments = [], isLoading: commentsLoading } =
    useTicketComments(id);
  const addComment = useAddComment();
  const [commentText, setCommentText] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return toast.error("اكتب تعليق أولاً");

    addComment.mutate(
      { ticketId: id, message: commentText.trim() },
      { onSuccess: () => setCommentText("") }
    );
  };

  /* ================== تغيير الحالة ================== */
  const updateStatus = (status: Ticket["status"]) => {
    updateTicket.mutate({ id, data: { status } });
  };

  /* ================== Loading / Error ================== */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20 text-red-600">التذكرة غير موجودة</div>
    );
  }

  /* ================== Helpers ================== */
  const attachments = ticket.attachments ?? [];

  const priorityMap = { high: "عالية", medium: "متوسطة", low: "منخفضة" };
  const priorityColorMap = {
    high: "bg-red-500 text-white",
    medium: "bg-orange-500 text-white",
    low: "bg-green-500 text-white",
  };
  const statusMap = {
    pending: "معلقة",
    "in-progress": "قيد المعالجة",
    resolved: "تم الحل",
  };
  const statusColorMap = {
    pending: "bg-yellow-500 text-white",
    "in-progress": "bg-blue-500 text-white",
    resolved: "bg-green-500 text-white",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6 pt-20">
      {/* ================== Header ================== */}
      <div className="flex justify-between items-center gap-4">
        <Link href="/dashboard/tickets">
          <Button variant="ghost">
            <ArrowLeft className="ml-2 h-4 w-4" />
            رجوع
          </Button>
        </Link>

        {editMode ? (
          <input
            className="text-3xl font-bold border-b outline-none w-full"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
          />
        ) : (
          <h1 className="text-3xl font-bold">{ticket.title}</h1>
        )}

        <div className="flex gap-2">
          {editMode ? (
            <>
              <Button
                onClick={() =>
                  updateTicket.mutate(
                    { id, data: editData },
                    { onSuccess: () => setEditMode(false) }
                  )
                }
              >
                حفظ
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditMode(false);
                  setEditData({
                    title: ticket.title,
                    description: ticket.description,
                  });
                }}
              >
                إلغاء
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setEditMode(true)}>
              تعديل
            </Button>
          )}
        </div>
      </div>

      {/* ================== Card ================== */}
      <Card>
        <CardHeader className="flex justify-between gap-4">
          <div className="flex gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(ticket.createdAt).toLocaleDateString("en-ua")}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {ticket.user?.name || currentUser?.name}
            </span>
          </div>

          <div className="flex gap-2">
            <Badge className={priorityColorMap[ticket.priority]}>
              {priorityMap[ticket.priority]}
            </Badge>
            <Badge className={statusColorMap[ticket.status]}>
              {statusMap[ticket.status]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* الوصف */}
          <div>
            <h3 className="font-semibold mb-2">الوصف</h3>
            {editMode ? (
              <Textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="min-h-32"
              />
            ) : (
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            )}
          </div>

          <Separator />

          {/* تغيير الحالة */}
          <div className="flex gap-4 items-center">
            <span className="font-semibold">الحالة:</span>
            <Select value={ticket.status} onValueChange={updateStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">معلقة</SelectItem>
                <SelectItem value="in-progress">قيد المعالجة</SelectItem>
                <SelectItem value="resolved">تم الحل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* المرفقات */}
          {attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  المرفقات ({attachments.length})
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {attachments.map((file, i) => (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border p-4 rounded-lg text-center hover:bg-gray-50"
                    >
                      <Paperclip className="mx-auto mb-2 text-gray-500" />
                      <p className="text-xs truncate">{file.originalName}</p>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* التعليقات */}
          <Separator />
          <h3 className="font-semibold">التعليقات ({comments.length})</h3>

          <form onSubmit={handleAddComment} className="flex gap-3">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="اكتب تعليق..."
              required
            />
            <Button type="submit">إرسال</Button>
          </form>

          <div className="space-y-6">
            {commentsLoading ? (
              <p className="text-center text-gray-500">جاري التحميل...</p>
            ) : (
              comments.map((c: any) => (
                <div key={c._id} className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>{(c.user?.name || "U")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-50 p-4 rounded-lg flex-1">
                    <p className="font-semibold">{c.user?.name}</p>
                    <p>{c.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
