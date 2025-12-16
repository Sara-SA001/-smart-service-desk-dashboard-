// src/app/(auth)/register/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegister } from "@/hooks/useAuth";
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            إنشاء حساب جديد
          </h1>
          <p className="text-lg text-gray-600">
            انضم إلى نظام الدعم الفني الذكي
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold text-indigo-700">
              مرحباً بك!
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              املأ البيانات أدناه لإنشاء حسابك
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* الاسم */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-base font-medium text-gray-700"
                >
                  الاسم الكامل <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="أحمد محمد علي"
                  className="h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* البريد */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-base font-medium text-gray-700"
                >
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ahmed@example.com"
                  className="h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* كلمة المرور */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-base font-medium text-gray-700"
                >
                  كلمة المرور <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* نوع الحساب */}
              <div className="space-y-2">
                <Label className="text-base font-medium text-gray-700">
                  نوع الحساب <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(v) => {
                    setValue("role", v as "staff" | "admin");
                    register("role");
                  }}
                  defaultValue="staff"
                >
                  <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl shadow-md hover:shadow-xl hover:border-indigo-500 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 text-base font-medium text-gray-800">
                    <SelectValue placeholder="اختر نوع الحساب" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-indigo-200 shadow-2xl rounded-xl overflow-hidden">
                    <SelectItem
                      value="staff"
                      className="relative pl-10 pr-4 py-3 hover:bg-indigo-100 transition-colors cursor-pointer font-medium"
                    >
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 opacity-0 select-item-check text-xl">
                        ✓
                      </span>
                      موظف (Staff)
                    </SelectItem>
                    <SelectItem
                      value="admin"
                      className="relative pl-10 pr-4 py-3 hover:bg-indigo-100 transition-colors cursor-pointer font-medium"
                    >
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 opacity-0 select-item-check text-xl">
                        ✓
                      </span>
                      مدير (Admin)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              {/* الزر */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending
                  ? "جاري إنشاء الحساب..."
                  : "إنشاء الحساب"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2025 Smart Service Desk • جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
