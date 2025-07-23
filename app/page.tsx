"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl mb-6">
            <span className="text-2xl font-bold text-white">LB</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-700 via-secondary-600 to-primary-800 bg-clip-text text-transparent mb-4">
            LihatBill
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Platform modern untuk mengelola dan membagi tagihan dengan mudah. Kelola keuangan Anda dengan lebih smart.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card
            className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105"
            onClick={() => router.push("/guest")}
          >
            <CardHeader className="text-center pb-6 pt-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-800 mb-2">Guest Mode</CardTitle>
              <CardDescription className="text-slate-600 text-base leading-relaxed">
                Mulai langsung tanpa registrasi. Perfect untuk split bill cepat dengan teman-teman.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Button className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-medium py-3 rounded-xl group-hover:shadow-lg transition-all duration-300">
                Mulai sebagai Guest
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card
            className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105"
            onClick={() => router.push("/login")}
          >
            <CardHeader className="text-center pb-6 pt-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-800 mb-2">Member Access</CardTitle>
              <CardDescription className="text-slate-600 text-base leading-relaxed">
                Akses fitur lengkap dengan dashboard analytics dan financial tracking yang powerful.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium py-3 rounded-xl group-hover:shadow-lg transition-all duration-300">
                Login sebagai Member
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">Trusted by 10,000+ users • Secure & Fast • Always Free</p>
        </div>
      </div>
    </div>
  )
}
