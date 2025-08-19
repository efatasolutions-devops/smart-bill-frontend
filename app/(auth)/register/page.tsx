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
import { Lock, User } from "lucide-react";
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
  dob: { startDate: string; endDate: string } | null;
  phone: string;
  address: string;
  gender: "male" | "female";
};

// Modal Komponen Sederhana
function Modal({ isOpen, onClose, title, message, type }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error";
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-lg p-6 w-80 text-center shadow-xl">
        <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${type === "success" ? "bg-green-100" : "bg-red-100"}`}>
          {type === "success" ? (
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 mb-4">{message}</p>
        <Button onClick={onClose} className="w-full">
          Tutup
        </Button>
      </div>
    </div>
  );
}

export default function Register() {
  const router = useRouter();
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<RegisterData>({
    mode: "onChange",
  });

  const handleLogin = () => {
    router.push("/login");
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const onRegister = async (data: RegisterData) => {
    try {
      const response = await axios.post("/api/register", {
        ...data,
        dob: data.dob?.startDate || null,
      });

      if (response.status === 201 || response.status === 200) {
        // Reset form setelah sukses
        reset();
        setModal({
          isOpen: true,
          title: "Berhasil!",
          message: "Akun berhasil dibuat. Silakan login.",
          type: "success",
        });
      }
    } catch (err: any) {
      const status = err.response?.status;
      const errorMsg = err.response?.data?.message || "Terjadi kesalahan";

      if (status === 409 || status === 400) {
        setModal({
          isOpen: true,
          title: "Gagal",
          message: "Email sudah digunakan. Gunakan email lain.",
          type: "error",
        });
      } else {
        setModal({
          isOpen: true,
          title: "Gagal",
          message: errorMsg || "Registrasi gagal. Coba lagi.",
          type: "error",
        });
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-800 mb-2">Daftar</CardTitle>
              <CardDescription className="text-slate-600">
                Buat akun untuk mengakses Lihat Bill Beta.<br /> Gunakan alamat email aktif, untuk dapat verifikasi ya!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <form onSubmit={handleSubmit(onRegister)}>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                      Email <span className="text-red-500">*</span>
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
                        placeholder="Masukkan email"
                        className="pl-10 border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm">{String(errors.email.message)}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        {...register("password", {
                          required: "Password wajib diisi",
                          minLength: {
                            value: 6,
                            message: "Password minimal 6 karakter",
                          },
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

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        {...register("name", {
                          required: "Nama wajib diisi",
                        })}
                        id="name"
                        placeholder="Masukkan nama"
                        className="pl-10 border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-slate-700 font-medium">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="dob"
                      control={control}
                      rules={{ required: "Tanggal lahir wajib diisi" }}
                      render={({ field }) => (
                        <Datepicker
                          inputClassName="w-full py-2.5 pl-4 pr-14 border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg font-light text-sm placeholder-gray-400 bg-white focus:ring focus:border-blue-500 focus:ring-blue-500/20"
                          showShortcuts
                          useRange={false}
                          asSingle={true}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-sm">{String(errors.dob.message)}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700 font-medium">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        {...register("phone", {
                          required: "Nomor telepon wajib diisi",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Hanya angka yang diperbolehkan",
                          },
                        })}
                        id="phone"
                        placeholder="Contoh: 081234567890"
                        className="pl-10 border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                        onKeyDown={(e) => {
                          if (
                            !/^\d$/.test(e.key) &&
                            !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
                              e.key
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{String(errors.phone.message)}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-slate-700 font-medium">
                      Alamat <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      {...register("address", {
                        required: "Alamat wajib diisi",
                      })}
                      id="address"
                      placeholder="Masukkan alamat lengkap"
                      className="border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">{String(errors.address.message)}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-slate-700 font-medium">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: "Jenis kelamin wajib dipilih" }}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === "male" ? "male" : "female")}
                          value={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Laki-laki</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Perempuan</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                    {errors.gender && (
                      <p className="text-red-500 text-sm">{String(errors.gender.message)}</p>
                    )}
                  </div>
                </div>

                {/* Tombol Daftar dengan jarak atas */}
                <Button
                  type="submit"
                  className="w-full mt-8 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Daftar
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Link ke Login */}
          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm">
              Sudah punya akun?{" "}
              <span
                className="text-primary-600 font-medium cursor-pointer hover:underline"
                onClick={handleLogin}
              >
                Masuk di sini
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </>
  );
}