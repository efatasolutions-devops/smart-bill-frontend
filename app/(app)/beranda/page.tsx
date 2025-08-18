"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ComingSoonOverlay from "@/components/coming-soon-overlay";
import {
  ArrowRight,
  Receipt,
  BarChart3,
  Wallet,
  Users,
  Clock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LayoutContext from "@/context/layout-context";
import { useRouter } from "next/navigation";

export default function BerandaPage() {
  const router = useRouter();
  const ctx = React.useContext(LayoutContext);

  const navigationItems = [
    {
      icon: Receipt,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      title: "Repot buat bagi bill beres nongkrong?",
      description: "Split bill dengan teman jadi mudah dan cepat",
      buttonText: "Split Bill",
      buttonColor: "border-emerald-500 text-emerald-600 hover:bg-emerald-50",
      href: "/splitbill",
    },
    {
      icon: BarChart3,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      title: "Mau ngecek total pengeluaran udah berapa?",
      description: "Pantau keuangan dengan dashboard analytics",
      buttonText: "Lihat Dashboard",
      buttonColor: "border-blue-500 text-blue-600 hover:bg-blue-50",
      href: "/dashboard",
    },
    {
      icon: Wallet,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      title: "Catet uang masuk dan keluar kamu gak ribet di sini",
      description: "Kelola transaksi harian dengan mudah",
      buttonText: "Buka Finance",
      buttonColor: "border-purple-500 text-purple-600 hover:bg-purple-50",
      href: "/finance",
    },
    {
      icon: Users,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      title: "Butuh bantuan atau ada pertanyaan?",
      description: "Tim support siap membantu kapan saja",
      buttonText: "Hubungi Support",
      buttonColor: "border-amber-500 text-amber-600 hover:bg-amber-50",
      href: "#support",
    },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "5 Tips Mengelola Keuangan Pribadi untuk Anak Muda",
      excerpt:
        "Belajar cara mengatur uang sejak dini akan membantu masa depan finansial yang lebih baik...",
      author: "Tim LihatBill",
      date: "15 Jan 2024",
      readTime: "5 min",
      image: "/placeholder.svg?height=200&width=300",
      category: "Tips Keuangan",
    },
    {
      id: 2,
      title: "Cara Efektif Split Bill saat Nongkrong Bareng Teman",
      excerpt:
        "Jangan sampai masalah uang merusak persahabatan. Ini cara mudah bagi tagihan yang fair...",
      author: "Sarah Wijaya",
      date: "12 Jan 2024",
      readTime: "3 min",
      image: "/placeholder.svg?height=200&width=300",
      category: "Lifestyle",
    },
    {
      id: 3,
      title: "Teknologi OCR: Revolusi Cara Kita Mencatat Pengeluaran",
      excerpt:
        "Tidak perlu lagi input manual satu per satu. Teknologi OCR membuat pencatatan jadi otomatis...",
      author: "Tech Team",
      date: "8 Jan 2024",
      readTime: "4 min",
      image: "/placeholder.svg?height=200&width=300",
      category: "Teknologi",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner - Responsif */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=600&width=1200&text=LihatBill+Hero+Banner"
            alt="LihatBill - Kelola Keuangan Jadi Mudah"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        </div>
        <div className="relative z-10 flex items-center h-full px-6">
          <div className="max-w-lg">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Kelola Keuangan & Bagi Bill Jadi Mudah
            </h1>
            <p className="text-lg text-white/90 mb-6">
              Aplikasi all-in-one untuk split bill, pencatatan keuangan, dan analisis pengeluaran.
            </p>
            <Button
              onClick={() => router.push("/splitbill")}
              className="bg-white text-slate-800 hover:bg-gray-100 font-semibold px-6 py-3 text-base"
            >
              Coba Sekarang
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Navigation Items */}
      <section className="px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-3">
              Apa yang Bisa Kamu Lakukan?
            </h2>
            <p className="text-base sm:text-xl text-slate-600">
              Cek fitur yang kamu butuhin disini!
            </p>
          </div>

          <div className="space-y-4">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center mb-4 sm:mb-0 sm:mr-6 w-full sm:w-auto">
                  <div
                    className={`w-12 h-12 ${item.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm">{item.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push(item.href)}
                  variant="outline"
                  className={`${item.buttonColor} px-6 py-2 w-full sm:w-auto font-medium`}
                >
                  {item.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="px-6 py-12 sm:py-16 bg-white/50 backdrop-blur-sm relative">
        <ComingSoonOverlay />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-3">
              Tips & Insights
            </h2>
            <p className="text-sm sm:text-xl text-slate-600">
              Baca artikel terbaru tentang keuangan dan teknologi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="group border-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-primary-100 text-primary-700 border-primary-200 text-xs px-2 py-1">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-800 leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-sm mt-1 line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {post.author}
                    </div>
                    <div>{post.date}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              variant="outline"
              className="border-slate-300 hover:bg-slate-50 px-6 py-2 text-sm bg-transparent"
            >
              Lihat Semua Artikel
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="sm:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">LB</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">LihatBill</h3>
                  <p className="text-slate-400 text-xs">Kelola uang jadi mudah</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Platform terpercaya untuk mengelola keuangan pribadi dan split bill bersama teman.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-base font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm">
                {["Split Bill", "Dashboard", "Finance Tracker", "Mobile App"].map((item, i) => (
                  <li key={i}>
                    <a
                      href={["/splitbill", "/dashboard", "/finance", "#"][i]}
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-base font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                {["Tentang Kami", "Karir", "Blog", "Press Kit"].map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-base font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-sm">
                {["Help Center", "Kontak", "Privacy Policy", "Terms of Service"].map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-xs text-center sm:text-left">
                © 2024 LihatBill. All rights reserved.
              </p>
              <div className="flex space-x-4">
                {["Facebook", "Twitter", "Instagram"].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-6 h-6 bg-slate-600 rounded"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}