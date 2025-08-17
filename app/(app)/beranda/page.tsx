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
    <>
      {/* Hero Banner - Static Image */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="relative w-full h-full">
          <img
            src="/placeholder.svg?height=600&width=1200&text=LihatBill+Hero+Banner+-+Split+Bill+Made+Easy"
            alt="LihatBill - Kelola Keuangan Jadi Mudah"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        </div>
      </section>
      {/* Navigation Items */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 font-display mb-4">
              Apa yang Bisa Kamu Lakukan?
            </h2>
            <p className="text-xl text-slate-600 font-body">
              Cek fitur yang kamu butuhin disini!
            </p>
          </div>

          <div className="space-y-4">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center space-x-6">
                  <div
                    className={`w-12 h-12 ${item.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 font-display mb-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 font-body text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push(item.href)}
                  variant="outline"
                  className={`${item.buttonColor} font-body btn-modern px-6 py-2 bg-transparent`}
                >
                  {item.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Blog Section */}
      <section className="px-6 py-16 bg-white/50 backdrop-blur-sm relative">
        <ComingSoonOverlay />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 font-display mb-4">
              Tips & Insights
            </h2>
            <p className="text-xl text-slate-600 font-body">
              Baca artikel terbaru tentang keuangan dan teknologi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="group card-modern border-0 overflow-hidden cursor-pointer"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-primary-100 text-primary-700 border-primary-200 text-xs font-body">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-xs text-slate-500 font-body">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-display font-bold text-slate-800 mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-body text-sm leading-relaxed">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-body">
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

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="glass-effect border-slate-200/50 hover:bg-white/80 font-body btn-modern px-8 py-3 bg-transparent"
            >
              Lihat Semua Artikel
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="px-6 py-16 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg font-display">
                    LB
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display">LihatBill</h3>
                  <p className="text-slate-400 text-sm font-body">
                    Kelola uang jadi mudah
                  </p>
                </div>
              </div>
              <p className="text-slate-300 font-body leading-relaxed">
                Platform terpercaya untuk mengelola keuangan pribadi dan split
                bill bersama teman.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-lg font-semibold font-display mb-4">
                Produk
              </h4>
              <ul className="space-y-3 font-body">
                <li>
                  <a
                    href="/splitbill"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Split Bill
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/finance"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Finance Tracker
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold font-display mb-4">
                Perusahaan
              </h4>
              <ul className="space-y-3 font-body">
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Karir
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Press Kit
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold font-display mb-4">
                Dukungan
              </h4>
              <ul className="space-y-3 font-body">
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Kontak
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 font-body text-sm">
                © 2024 LihatBill. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <div className="w-6 h-6 bg-slate-600 rounded"></div>
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <div className="w-6 h-6 bg-slate-600 rounded"></div>
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <div className="w-6 h-6 bg-slate-600 rounded"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
