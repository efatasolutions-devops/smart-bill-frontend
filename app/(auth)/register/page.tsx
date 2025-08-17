"use client";

import { useState } from "react";
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
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Datepicker from "react-tailwindcss-datepicker";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type RegisterData = {
  email: string;
  password: string;
  name: string;
  dob: string;
  phone: string;
  address: string;
  /**
   * 1 => female
   * 0 => male
   */
  gender: "male" | "female";
};

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handleGoogleRegister = () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", "Google User");
    router.push("/login");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const onRegister = (data) => {
    axios.post("/api/register", {
      ...data,
      dob: data?.dob?.startDate,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-800 mb-2">
              Daftar
            </CardTitle>
            <CardDescription className="text-slate-600">
              Masuk untuk mengakses dashboard dan fitur lengkap LihatBill
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit(onRegister)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email
                  </Label>
                  <div className="email">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      {...register("email", {
                        required: true,
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
                      {...register("password", {
                        required: true,
                      })}
                      id="password"
                      type="password"
                      placeholder="Masukkan password"
                      className="pl-10 border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500">
                      {String(errors.password?.message) ||
                        "This field is required"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Name
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      {...register("name", {
                        required: true,
                      })}
                      id="name"
                      placeholder="Masukkan Nama"
                      className="pl-10 border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500">
                      {String(errors.name?.message) || "This field is required"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Date of Birth
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Controller
                      name="dob"
                      control={control}
                      render={({ field }) => {
                        return (
                          <Datepicker
                            inputClassName="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20 py-[8px] px-[12px]"
                            showShortcuts
                            useRange={false}
                            asSingle={true}
                            value={field.value}
                            onChange={(newValue) => {
                              field.onChange(newValue);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500">
                      {String(errors.name?.message) || "This field is required"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    Phone
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      {...register("phone")}
                      id="phone"
                      placeholder="Masukkan Phone"
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                          ".",
                          ",",
                        ];

                        const allowedShiftKeys = ["+"];

                        const isCtrl = e.ctrlKey || e.metaKey;

                        const isShift = e?.shiftKey;

                        if (
                          (isShift && allowedShiftKeys?.includes(e?.key)) ||
                          allowedKeys.includes(e.key) ||
                          (isCtrl &&
                            ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
                        ) {
                          return;
                        }

                        const isNumber = /^[0-9]$/.test(e.key);

                        if (!isNumber) {
                          e.preventDefault();
                        }
                      }}
                      className="pl-10 border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500">
                      {String(errors.name?.message) || "This field is required"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    Address
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Textarea
                      {...register("address")}
                      id="address"
                      placeholder="Masukkan Address"
                      className="pl-10 border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500">
                      {String(errors.name?.message) || "This field is required"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="gender"
                    className="text-slate-700 font-medium"
                  >
                    Gender
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <RadioGroup {...register("gender")} id="gender">
                      <div style={{ display: "flex" }}>
                        <RadioGroupItem value="1" id="1" />
                        <Label htmlFor="1">Male</Label>
                      </div>
                      <div style={{ display: "flex" }}>
                        <RadioGroupItem value="0" id="0" />
                        <Label htmlFor="0">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {errors.name && (
                    <p className="text-red-500">
                      {String(errors.name?.message) || "This field is required"}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Register
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
              onClick={handleGoogleRegister}
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
            Sudah punya akun?{" "}
            <span
              className="text-primary-600 font-medium cursor-pointer hover:underline"
              onClick={() => {
                handleLogin();
              }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
