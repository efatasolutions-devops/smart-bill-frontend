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
        "p-4 sm:p-6",
        ctx?.isSidebarCollapsed ? "ml-20" : "ml-72",
        "transition-all duration-200 min-h-screen"
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">Analisis keuangan kamu</p>
        </div>
        <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 self-start">
          <Crown className="w-4 h-4 mr-1" />
          PRO FEATURE
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8">
        {/* Total Pengeluaran */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm text-slate-600 font-medium">
                Total Pengeluaran
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 via-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-slate-800">
              Rp {totalExpenses.toLocaleString("id-ID")}
            </div>
            <p className="text-xs sm:text-sm text-slate-500">Bulan ini</p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>

        {/* Total Pendapatan */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm text-slate-600 font-medium">
                Total Pendapatan
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-slate-800">
              Rp {totalIncome.toLocaleString("id-ID")}
            </div>
            <p className="text-xs sm:text-sm text-slate-500">Bulan ini</p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>

        {/* Total Transaksi */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm text-slate-600 font-medium">
                Total Transaksi
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow">
                <Receipt className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-slate-800">
              {thisMonthTransactions}
            </div>
            <p className="text-xs sm:text-sm text-slate-500">Transaksi tercatat</p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>
      </div>

      {/* Calendar Section */}
      <Card className="relative overflow-hidden">
        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/70 to-slate-200/70 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-center p-6 max-w-xs mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Premium Only</h3>
            <p className="text-slate-600 text-sm mb-4">
              Unlock advanced calendar tracking and analytics
            </p>
            <Button
              onClick={handleCalendarClick}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm"
            >
              <Crown className="w-4 h-4 mr-1" />
              Upgrade to Pro
            </Button>
          </div>
        </div>

        {/* Calendar Header */}
        <CardHeader className="opacity-30 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <CardTitle className="text-base sm:text-xl font-semibold text-slate-800">
                  Kalender Keuangan
                </CardTitle>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>
                    Pendapatan
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-rose-500 rounded-full mr-1"></div>
                    Pengeluaran
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-2 opacity-50"
              >
                Monthly
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-2 opacity-50"
              >
                Weekly
              </Button>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0 opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              {currentDate.toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0 opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Calendar Grid */}
        <CardContent className="opacity-30">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-xs text-slate-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className="h-16 sm:h-20 bg-white/50 rounded-lg p-1 text-xs border border-slate-200/30"
              >
                <div className="font-semibold text-slate-700 text-center">
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