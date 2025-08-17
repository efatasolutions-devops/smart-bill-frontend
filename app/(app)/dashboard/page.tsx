"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Receipt,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Crown,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LayoutContext from "@/context/layout-context";
import ComingSoonOverlay from "@/components/coming-soon-overlay";

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<"monthly" | "weekly">(
    "monthly"
  );
  const ctx = React.useContext(LayoutContext);

  // Mock data
  const totalExpenses = 1250000;
  const totalIncome = 2550000;
  const thisMonthTransactions = 24;

  const handleCalendarClick = () => {
    ctx?.setShowPremiumModal(true);
  };

  return (
    <div
      className={cn(
        ctx?.isSidebarCollapsed ? "ml-20" : "ml-72",
        "p-6 relative z-10 transition-all duration-200"
      )}
    >
      {/* Header with Premium Badge */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-4xl font-bold text-slate-800 font-display">
            Dashboard
          </h1>
          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 border-0">
            <Crown className="w-4 h-4 mr-1" />
            PRO FEATURE
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <Card className="card-modern border-0 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 font-body">
              Total Pengeluaran
            </CardTitle>
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-800 mb-2 font-display">
              Rp {totalExpenses.toLocaleString()}
            </div>
            <p className="text-sm text-slate-500 font-body">Bulan ini</p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>

        <Card className="card-modern border-0 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 font-body">
              Total Pendapatan
            </CardTitle>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-800 mb-2 font-display">
              Rp {totalIncome.toLocaleString()}
            </div>
            <p className="text-sm text-slate-500 font-body">Bulan ini</p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>

        <Card className="card-modern border-0 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 font-body">
              Total Transaksi
            </CardTitle>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Receipt className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-800 mb-2 font-display">
              {thisMonthTransactions}
            </div>
            <p className="text-sm text-slate-500 font-body">
              Transaksi tercatat
            </p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>
      </div>

      {/* Calendar with Premium Overlay */}
      <Card className="card-modern border-0 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-200/50 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 font-display mb-3">
              Premium Feature
            </h3>
            <p className="text-slate-600 font-body mb-6 max-w-md">
              Unlock advanced calendar tracking with detailed expense analytics
              and insights
            </p>
            <Button
              onClick={handleCalendarClick}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-semibold px-8 py-3 rounded-xl btn-modern shadow-xl"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
        </div>

        <CardHeader className="opacity-30">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-slate-800 font-display text-2xl">
                  Kalender Keuangan
                </CardTitle>
                <p className="text-sm text-slate-500 mt-2 font-body">
                  <span className="inline-flex items-center mr-6">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    Pendapatan
                  </span>
                  <span className="inline-flex items-center">
                    <div className="w-3 h-3 bg-rose-500 rounded-full mr-2"></div>
                    Pengeluaran
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="glass-effect border-slate-200/50 bg-transparent"
              >
                Monthly
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="glass-effect border-slate-200/50 bg-transparent"
              >
                Weekly
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              size="sm"
              className="glass-effect border-slate-200/50 bg-transparent"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h3 className="text-xl font-bold text-slate-800 font-display">
              {currentDate.toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="glass-effect border-slate-200/50 bg-transparent"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="opacity-30">
          <div className="grid grid-cols-7 gap-3 mb-6">
            {[
              "Minggu",
              "Senin",
              "Selasa",
              "Rabu",
              "Kamis",
              "Jumat",
              "Sabtu",
            ].map((day) => (
              <div
                key={day}
                className="text-center font-bold text-slate-600 py-4 text-sm font-body tracking-wide"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="h-32 glass-effect rounded-2xl p-3">
                <div className="font-semibold text-sm text-slate-700 font-display">
                  {(i % 30) + 1}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
