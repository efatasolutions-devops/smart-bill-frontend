"use client";

import { useId, useState } from "react";
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
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const id = useId();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handleLogin = (data: LoginProps) => {
    if (data?.email && data?.password) {
      setLoadingLogin(true);

      axios
        .post("/api/login", data)
        ?.then((response) => {
          if (response?.data) {
            const resData = response?.data;

            Cookies.set("token", resData?.token, { expires: 7 });
            router.push("/beranda");
          }
        })
        ?.finally(() => {
          setLoadingLogin(false);
        });
      // Cookies.set("username", username, { expires: 7 });
      // router.push("/beranda");
    }
  };

  const handleGoogleLogin = () => {
    Cookies.set("token", id, { expires: 7 });
    Cookies.set("username", username, { expires: 7 });
    router.push("/beranda");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="border-slate-300 hover:bg-slate-50"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-800 mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-600">
              Masuk untuk mengakses dashboard dan fitur lengkap LihatBill
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email
                  </Label>
                  <div className="email">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      {...register("email", {
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
                    <p className="text-red-500">
                      {String(errors.email?.message) ||
                        "This field is required"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-slate-700 font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      {...register("password")}
                      id="password"
                      type="password"
                      placeholder="Masukkan password"
                      className="pl-10 border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Login
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-500 font-medium">
                  Atau
                </span>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent py-3 rounded-lg font-medium transition-all duration-300"
            >
              <Mail className="w-4 h-4 mr-2" />
              Login dengan Google
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            Belum punya akun?{" "}
            <span
              className="text-primary-600 font-medium cursor-pointer hover:underline"
              onClick={() => {
                handleRegister();
              }}
            >
              Daftar sekarang
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
