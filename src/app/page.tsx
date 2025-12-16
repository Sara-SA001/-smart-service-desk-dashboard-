// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LogIn,
  UserPlus,
  Ticket,
  CheckCircle2,
  Clock,
  Users,
  Paperclip,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
            Smart Service Desk
          </h1>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            نظام إدارة التذاكر الذكي — سريع، سهل، احترافي، ومصمم خصيصًا لفريقك
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold">تسجيل الدخول</CardTitle>
              <CardDescription className="text-lg mt-4">
                لديك حساب؟ ادخل الآن وابدأ إدارة طلبات الدعم
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="px-16 py-8 text-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl"
                >
                  تسجيل الدخول
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold">
                إنشاء حساب جديد
              </CardTitle>
              <CardDescription className="text-lg mt-4">
                جديد هنا؟ سجل وانضم إلى فريق الدعم الفني
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-16 py-8 text-xl border-4 border-green-600 hover:bg-green-50 shadow-xl"
                >
                  إنشاء حساب
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 bg-white/90 backdrop-blur-sm lg:col-span-1">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <Ticket className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold">
                مميزات النظام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-6 text-right text-lg">
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
                  <span>إدارة التذاكر بسهولة وسرعة</span>
                </li>
                <li className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-orange-600 flex-shrink-0" />
                  <span>تتبع حالة الطلبات في الوقت الفعلي</span>
                </li>
                <li className="flex items-center gap-4">
                  <Paperclip className="h-8 w-8 text-indigo-600 flex-shrink-0" />
                  <span>رفع المرفقات والصور</span>
                </li>
                <li className="flex items-center gap-4">
                  <Users className="h-8 w-8 text-purple-600 flex-shrink-0" />
                  <span>دعم متعدد المستخدمين والأدوار</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-24">
          <p className="text-xl text-gray-600">
            © 2025 Smart Service Desk — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}
