// src/app/(auth)/register/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegister } from "@/hooks/useAuth"; // ← الجديد
import Link from "next/link";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(3, "الاسم قصير جدًا"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  role: z.enum(["staff", "admin"], {
    message: "يرجى اختيار نوع الحساب",
  }),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const registerMutation = useRegister();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "staff" },
  });

  const onSubmit = (data: FormData) => {
    registerMutation.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
      {
        onSuccess: () => {
          router.push("/login");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            إنشاء حساب جديد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" placeholder="أحمد محمد" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@company.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>نوع الحساب</Label>
              <Select
                onValueChange={(v) => {
                  setValue("role", v as "staff" | "admin");
                  register("role");
                }}
                defaultValue="staff"
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الحساب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">موظف (Staff)</SelectItem>
                  <SelectItem value="admin">مدير (Admin)</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending
                ? "جاري إنشاء الحساب..."
                : "إنشاء الحساب"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              لديك حساب؟{" "}
              <Link href="/login" className="text-primary hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
