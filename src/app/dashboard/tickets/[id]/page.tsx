// src/app/dashboard/tickets/[id]/page.tsx
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

  const { data: ticket, isLoading } = useQuery<Ticket>({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const res = await api.get(`/tickets/${id}`);
      return res.data;
    },
  });

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

  const updateStatus = (status: Ticket["status"]) => {
    updateTicket.mutate({ id, data: { status } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20 text-red-600 text-2xl">
        التذكرة غير موجودة
      </div>
    );
  }

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
    <div className="max-w-6xl mx-auto space-y-12 p-6 pt-24">
      {/* Header */}
      <div className="flex justify-between items-start gap-8">
        <Link href="/dashboard/tickets">
          <Button variant="ghost" size="lg" className="hover:bg-indigo-50">
            <ArrowLeft className="ml-3 h-6 w-6" />
            رجوع إلى التذاكر
          </Button>
        </Link>

        <div className="flex-1 text-center">
          {editMode ? (
            <input
              className="text-4xl font-bold text-center w-full bg-transparent border-b-4 border-indigo-500 outline-none"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />
          ) : (
            <h1 className="text-4xl font-bold text-gray-900">{ticket.title}</h1>
          )}
        </div>

        <div className="flex gap-4">
          {editMode ? (
            <>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={() =>
                  updateTicket.mutate(
                    { id, data: editData },
                    { onSuccess: () => setEditMode(false) }
                  )
                }
              >
                حفظ التغييرات
              </Button>
              <Button
                variant="outline"
                size="lg"
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
            <Button
              size="lg"
              variant="outline"
              onClick={() => setEditMode(true)}
            >
              تعديل التذكرة
            </Button>
          )}
        </div>
      </div>

      {/* Main Card */}
      <Card className="shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
          <div className="flex justify-between items-center flex-wrap gap-6">
            <div className="flex flex-wrap gap-8 text-lg text-gray-700">
              <span className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-indigo-600" />
                {new Date(ticket.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-3">
                <User className="h-6 w-6 text-indigo-600" />
                {ticket.user?.name || currentUser?.name || "مستخدم"}
              </span>
            </div>

            <div className="flex gap-4">
              <Badge
                className={`${
                  priorityColorMap[ticket.priority]
                } text-lg px-6 py-3 rounded-full`}
              >
                {priorityMap[ticket.priority]}
              </Badge>
              <Badge
                className={`${
                  statusColorMap[ticket.status]
                } text-lg px-6 py-3 rounded-full`}
              >
                {statusMap[ticket.status]}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-10 space-y-12">
          {/* الوصف */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">الوصف</h3>
            {editMode ? (
              <Textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="min-h-48 text-lg border-2 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            ) : (
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-xl">
                {ticket.description}
              </p>
            )}
          </div>

          <Separator className="my-8" />

          {/* تغيير الحالة */}
          <div className="flex items-center gap-6">
            <span className="text-xl font-semibold text-gray-800">
              حالة التذكرة:
            </span>
            <Select value={ticket.status} onValueChange={updateStatus}>
              <SelectTrigger className="w-64 h-14 text-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl shadow-md hover:shadow-xl hover:border-indigo-500 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 transition-all duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-indigo-200 shadow-2xl rounded-xl">
                <SelectItem
                  value="pending"
                  className="py-4 hover:bg-indigo-100 relative pl-10"
                >
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 opacity-0 select-item-check text-xl">
                    ✓
                  </span>
                  معلقة
                </SelectItem>
                <SelectItem
                  value="in-progress"
                  className="py-4 hover:bg-indigo-100 relative pl-10"
                >
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 opacity-0 select-item-check text-xl">
                    ✓
                  </span>
                  قيد المعالجة
                </SelectItem>
                <SelectItem
                  value="resolved"
                  className="py-4 hover:bg-indigo-100 relative pl-10"
                >
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 opacity-0 select-item-check text-xl">
                    ✓
                  </span>
                  تم الحل
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* المرفقات */}
          {attachments.length > 0 && (
            <>
              <Separator className="my-8" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                  <Paperclip className="h-8 w-8 text-indigo-600" />
                  المرفقات ({attachments.length})
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {attachments.map((file, i) => (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100"
                    >
                      <Paperclip className="mx-auto mb-4 h-12 w-12 text-indigo-600 group-hover:scale-110 transition-transform" />
                      <p className="text-center text-sm text-gray-700 truncate group-hover:text-indigo-700">
                        {file.originalName}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* التعليقات */}
          <Separator className="my-12" />
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">
              التعليقات ({comments.length})
            </h3>

            <form onSubmit={handleAddComment} className="flex gap-4">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                className="flex-1 min-h-32 text-lg rounded-xl border-2 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="h-full px-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl"
              >
                إرسال
              </Button>
            </form>

            <div className="space-y-6">
              {commentsLoading ? (
                <p className="text-center text-gray-500 text-lg py-12">
                  جاري تحميل التعليقات...
                </p>
              ) : comments.length === 0 ? (
                <p className="text-center text-gray-500 text-xl py-16">
                  لا توجد تعليقات بعد، كن أول من يعلق!
                </p>
              ) : (
                comments.map((c: any) => (
                  <div
                    key={c._id}
                    className="flex gap-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-md"
                  >
                    <Avatar className="h-14 w-14 border-4 border-white shadow-lg">
                      <AvatarFallback className="text-xl font-bold bg-indigo-600 text-white">
                        {(c.user?.name || "U")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-bold text-xl text-indigo-800">
                          {c.user?.name || currentUser?.name || "مستخدم"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(c.createdAt).toLocaleString("ar-EG")}
                        </p>
                      </div>
                      <p className="text-lg text-gray-800 leading-relaxed bg-white p-5 rounded-xl shadow-inner">
                        {c.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
