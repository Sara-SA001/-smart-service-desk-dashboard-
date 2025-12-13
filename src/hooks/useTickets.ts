// src/hooks/useTickets.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export interface Ticket {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  //departmentId: string;
  createdAt: string;
  departmentId: { _id: string; name: string };
  [key: string]: any;
}

export const useTickets = () => {
  return useQuery<Ticket[]>({
    queryKey: ["tickets"],
    queryFn: async () => {
      const res = await api.get("/tickets/");
      if (Array.isArray(res.data)) return res.data;
      if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
      if (res.data?.tickets && Array.isArray(res.data.tickets)) return res.data.tickets;
      return [];
    },
  });
};


export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      departmentId: string;
      priority: "low" | "medium" | "high";
      attachments?: string[];
    }) => {
      console.log("البيانات اللي بتترسل:", data); // شوف ده في الـ Console
      const res = await api.post("/tickets/", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("تم إنشاء التذكرة بنجاح!");
    },
    onError: (err: any) => {
      toast.error("فشل إنشاء التذكرة", {
        description: err.response?.data?.error || "حدث خطأ",
      });
    },
  });
};

// أضف ده تحت useCreateTicket
export const useTicketComments = (ticketId: string) => {
  return useQuery({
    queryKey: ["ticket-comments", ticketId],
    queryFn: async () => {
      const res = await api.get(`/tickets/${ticketId}/comments`);
      return res.data || [];
    },
    enabled: !!ticketId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      const res = await api.post(`/tickets/${ticketId}/comments`, { message });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket-comments", variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.ticketId] });
      toast.success("تم إضافة التعليق بنجاح!");
    },
    onError: () => {
      toast.error("فشل إضافة التعليق");
    },
  });
};

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file); // مهم جدًا الاسم "file"

      console.log("رفع ملف:", file.name, file.size, file.type); // شوف ده في الـ Console

      const res = await api.post("/uploads/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // مهم لو الـ axios مش بيحطه تلقائي
        },
      });

      console.log("رد الـ backend:", res.data); // شوف الرد

      return res.data; // { url: "..." }
    },
    onSuccess: (data) => {
      toast.success("تم رفع الملف بنجاح");
      console.log("URL الملف:", data.url);
    },
    onError: (err: any) => {
      console.error("خطأ رفع الملف:", err.response?.data || err.message);
      toast.error("فشل رفع الملف: " + (err.response?.data?.message || "خطأ غير معروف"));
    },
  });
};



export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        title: string;
        description: string;
        status: string;
        priority: string;
        departmentId: string;
      }>;
    }) => {
      const res = await api.patch(`/tickets/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] });
      toast.success("تم تحديث التذكرة بنجاح");
    },
    onError: () => {
      toast.error("فشل تحديث التذكرة");
    },
  });
};



export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tickets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("تم حذف التذكرة بنجاح");
    },
    onError: () => {
      toast.error("فشل حذف التذكرة");
    },
  });
};
