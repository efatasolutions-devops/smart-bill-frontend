"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, ArrowRight, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // const isUserLogin = localStorage?.getItem("isLoggedIn");
    // const hasUserName = localStorage?.getItem("username");
    // // Redirect to Beranda instead of dashboard

    // if (isUserLogin && hasUserName) {
    //   router.push("/beranda");
    // } else {
    //   router.push("/login");
    // }

    router.push("/beranda");
  }, [router]);

  return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-200/30 to-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-secondary-100/20 to-primary-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 rounded-3xl mb-8 shadow-2xl">
            <span className="text-3xl font-bold text-white font-display">
              LB
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-7xl md:text-8xl font-bold font-display gradient-text mb-6 tracking-tight">
              LihatBill
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-body font-light">
              Platform modern untuk mengelola dan membagi tagihan dengan mudah.
              <span className="font-medium text-slate-700">
                {" "}
                Kelola keuangan Anda dengan lebih smart.
              </span>
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-body">
              <Sparkles className="w-4 h-4 text-accent-500" />
              <span>Trusted by 10,000+ users</span>
              <span>•</span>
              <Zap className="w-4 h-4 text-primary-500" />
              <span>Secure & Fast</span>
              <span>•</span>
              <span className="font-medium text-accent-600">Always Free</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card
            className="group card-modern cursor-pointer border-0 overflow-hidden"
            onClick={() => router.push("/guest")}
          >
            <CardHeader className="text-center pb-8 pt-10 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-50/50 to-yellow-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-display font-bold text-slate-800 mb-4">
                  Guest Mode
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg leading-relaxed font-body">
                  Mulai langsung tanpa registrasi. Perfect untuk split bill
                  cepat dengan teman-teman.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center pb-10 relative">
              <Button className="w-full bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700 hover:from-accent-600 hover:via-accent-700 hover:to-accent-800 text-white font-display font-semibold py-4 rounded-2xl btn-modern shadow-xl">
                Mulai sebagai Guest
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </CardContent>
          </Card>

          <Card
            className="group card-modern cursor-pointer border-0 overflow-hidden"
            onClick={() => router.push("/login")}
          >
            <CardHeader className="text-center pb-8 pt-10 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                  <UserCheck className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-display font-bold text-slate-800 mb-4">
                  Member Access
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg leading-relaxed font-body">
                  Akses fitur lengkap dengan dashboard analytics dan financial
                  tracking yang powerful.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center pb-10 relative">
              <Button className="w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 hover:from-primary-600 hover:via-secondary-600 hover:to-primary-700 text-white font-display font-semibold py-4 rounded-2xl btn-modern shadow-xl">
                Login sebagai Member
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
