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
import { LogIn, UserPlus, Ticket, Users, Building2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Smart Service Desk
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نظام إدارة التذاكر الذكي — سريع، سهل، احترافي
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* بطاقة تسجيل الدخول */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <LogIn className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>تسجيل الدخول</CardTitle>
              <CardDescription>
                لديك حساب؟ ادخل الآن وابدأ العمل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button className="w-full" size="lg">
                  تسجيل الدخول
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* بطاقة إنشاء حساب */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <UserPlus className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle>إنشاء حساب جديد</CardTitle>
              <CardDescription>جديد هنا؟ سجل وانضم للفريق</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/register">
                <Button className="w-full" variant="outline" size="lg">
                  إنشاء حساب
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* بطاقة ميزات النظام */}
          <Card className="hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader>
              <Ticket className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle>مميزات النظام</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-right">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span>إدارة التذاكر بسهولة</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span>تتبع حالة الطلبات</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span>رفع المرفقات</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span>دعم كامل للغة العربية</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500">
            © 2025 Smart Service Desk — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}
