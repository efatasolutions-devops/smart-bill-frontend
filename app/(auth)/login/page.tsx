"use client";

import { useId, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import axios from "axios";

type LoginProps = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const id = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginProps>({
    mode: "onChange",
  });

  const email = watch("email");
  const password = watch("password");

  useEffect(() => {
    if (email || password) {
      setErrorMessage(null);
    }
  }, [email, password]);

  const handleLogin = (data: LoginProps) => {
    if (!data.email || !data.password) return;

    setLoadingLogin(true);
    setErrorMessage(null);

    axios
      .post("/api/login", data)
      .then((response) => {
        if (response?.data) {
          const resData = response.data;

          if (resData.verified === false) {
            setErrorMessage("Email Akun Belum Terverifikasi");
            return;
          }

          Cookies.set("token", resData.token, { expires: 7 });
          router.push("/beranda");
        }
      })
      .catch((err) => {
        const status = err.response?.status;
        const backendMsg = err.response?.data?.message;

        if (status === 401 || status === 400) {
          setErrorMessage("Password / Username tidak dikenali");
        } else if (status === 403 || backendMsg?.includes("not verified")) {
          setErrorMessage("Email Akun Belum Terverifikasi");
        } else {
          setErrorMessage("Terjadi kesalahan. Coba lagi.");
        }
      })
      .finally(() => {
        setLoadingLogin(false);
      });
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Utama Login */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-800 mb-2">Halo, Selamat Datang!</CardTitle>
            <CardDescription className="text-slate-600">
              Silakan masuk ke akun yang telah terdaftar untuk mengakses Lihat Bill Beta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="space-y-4">
                {/* Input Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      {...register("email", {
                        required: "Email wajib diisi",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Format email tidak valid",
                        },
                      })}
                      id="email"
                      placeholder="Masukkan Email"
                      className="pl-10 border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{String(errors.email.message)}</p>
                  )}
                </div>

                {/* Input Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      {...register("password", {
                        required: "Password wajib diisi",
                      })}
                      id="password"
                      type="password"
                      placeholder="Masukkan password"
                      className="pl-10 border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
                  )}
                </div>
              </div>

              {/* Pesan Error */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mt-4">
                  {errorMessage}
                </div>
              )}

              {/* Tombol Login */}
              <Button
                type="submit"
                disabled={loadingLogin}
                className="w-full mt-8 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loadingLogin ? "Memuat..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Link Daftar */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            Belum punya akun?{" "}
            <span
              className="text-primary-600 font-medium cursor-pointer hover:underline"
              onClick={handleRegister}
            >
              Daftar sekarang
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}