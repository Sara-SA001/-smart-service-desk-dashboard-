// src/hooks/useAuth.ts
"use client";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// تسجيل الدخول
export const useLogin = () => {
  const router = useRouter();
  const login = useAuthStore((s => s.login));

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await api.post("/auth/login", { email, password });
      return res.data; // { token: "...", user?: {...} }
    },
    onSuccess: (data) => {
      const user = data.user || {
        id: -1,
        name: data.email?.split("@")[0] || "مستخدم",
        email: data.email || "",
        role: "staff" as const,
      };
      login(user, data.token);
      toast.success("تم تسجيل الدخول بنجاح");
      router.push("/dashboard");
    },
    onError: (err: any) => {
      toast.error("فشل تسجيل الدخول", {
        description: err.response?.data?.message || "تأكد من البيانات",
      });
    },
  });
};

// إنشاء حساب
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
      role = "staff",
    }: {
      name: string;
      email: string;
      password: string;
      role?: "admin" | "staff";
    }) => {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("تم إنشاء الحساب بنجاح", {
        description: "يمكنك الآن تسجيل الدخول",
      });
      router.push("/login");
    },
    onError: (err: any) => {
      toast.error("فشل إنشاء الحساب", {
        description: err.response?.data?.message || "حدث خطأ",
      });
    },
  });
};

// للاستخدام العام (مثلاً في الـ Sidebar أو Header)
export const useAuth = () => {
  return useAuthStore();
};