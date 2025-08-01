"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Mail, Lock, User, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (username && password) {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("username", username)
      router.push("/dashboard")
    }
  }

  const handleGoogleLogin = () => {
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("username", "Google User")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/20 to-secondary-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-200/20 to-primary-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="glass-effect border-slate-200/50 hover:bg-white/80 btn-modern font-body"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>

        <Card className="card-modern border-0 overflow-hidden">
          <CardHeader className="text-center pb-8 pt-10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-secondary-50/30"></div>
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-display font-bold text-slate-800 mb-3">Welcome Back</CardTitle>
              <CardDescription className="text-slate-600 font-body text-base">
                Masuk untuk mengakses dashboard dan fitur lengkap LihatBill
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 px-10 pb-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-slate-700 font-body font-medium text-sm">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="username"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12 h-12 border-slate-200/50 focus:border-primary-400 focus:ring-primary-400/20 rounded-xl font-body bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-slate-700 font-body font-medium text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 border-slate-200/50 focus:border-primary-400 focus:ring-primary-400/20 rounded-xl font-body bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 hover:from-primary-600 hover:via-secondary-600 hover:to-primary-700 text-white font-display font-semibold h-12 rounded-xl btn-modern shadow-xl"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Login
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-slate-200/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-6 text-slate-500 font-body font-medium tracking-wider">Atau</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full glass-effect border-slate-200/50 text-slate-700 hover:bg-white/80 h-12 rounded-xl font-body font-medium btn-modern bg-transparent"
            >
              <Mail className="w-5 h-5 mr-3" />
              Login dengan Google
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-slate-500 font-body">
            Belum punya akun?{" "}
            <span className="text-primary-600 font-medium cursor-pointer hover:underline transition-all duration-200">
              Daftar sekarang
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
