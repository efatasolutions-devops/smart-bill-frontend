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
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Plus,
  Crown,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { PremiumModal } from "@/components/premium-modal";
import ComingSoonOverlay from "@/components/coming-soon-overlay";
import { cn } from "@/lib/utils";
import LayoutContext from "@/context/layout-context";

export default function FinancePage() {
  const ctx = React.useContext(LayoutContext);

  // Mock financial data
  const totalIncome = 10000000;
  const totalExpenses = 3750000;
  const netIncome = totalIncome - totalExpenses;
  const budgetUsage = 65;

  const transactions = [
    {
      id: "1",
      date: "2024-01-22",
      description: "Gaji Bulanan",
      amount: 8000000,
      type: "income",
      category: "Salary",
    },
    {
      id: "2",
      date: "2024-01-20",
      description: "Makan di Resto",
      amount: 150000,
      type: "expense",
      category: "Food",
    },
    {
      id: "3",
      date: "2024-01-18",
      description: "Belanja Groceries",
      amount: 250000,
      type: "expense",
      category: "Shopping",
    },
    {
      id: "4",
      date: "2024-01-15",
      description: "Freelance Project",
      amount: 2000000,
      type: "income",
      category: "Freelance",
    },
    {
      id: "5",
      date: "2024-01-12",
      description: "Bayar Listrik",
      amount: 350000,
      type: "expense",
      category: "Utilities",
    },
  ];

  const budgets = [
    { category: "Food", budgeted: 1000000, spent: 650000 },
    { category: "Shopping", budgeted: 500000, spent: 250000 },
    { category: "Transportation", budgeted: 300000, spent: 180000 },
    { category: "Entertainment", budgeted: 400000, spent: 320000 },
  ];

  const handleAddTransaction = () => {
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
            Finance
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your income & expenses</p>
        </div>
        <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 self-start">
          <Crown className="w-4 h-4 mr-1" />
          PRO FEATURE
        </Badge>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-8">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm text-slate-600 font-medium">
                Total Income
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl font-bold text-green-600">
              Rp {totalIncome.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500">Bulan ini</p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm text-slate-600 font-medium">
                Total Expenses
              </CardTitle>
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl font-bold text-red-600">
              Rp {totalExpenses.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500">Bulan ini</p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm text-slate-600 font-medium">
                Net Income
              </CardTitle>
              <DollarSign className="w-4 h-4 text-slate-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-lg sm:text-xl font-bold ${
                netIncome >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Rp {netIncome.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500">Sisa bulan ini</p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm text-slate-600 font-medium">
                Budget Usage
              </CardTitle>
              <Target className="w-4 h-4 text-slate-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl font-bold text-slate-800">
              {budgetUsage}%
            </div>
            <p className="text-xs text-slate-500">Dari total budget</p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>
      </div>

      {/* Recent Transactions & Budget Tracking */}
      <div className="grid grid-cols-1 gap-8">
        {/* Recent Transactions */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Transaksi Terbaru
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  5 transaksi terakhir
                </CardDescription>
              </div>
              <Button
                onClick={handleAddTransaction}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 relative"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-200/50 rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(transaction.date).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-sm ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"} Rp{" "}
                      {transaction.amount.toLocaleString("id-ID")}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>

        {/* Budget Tracking */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">
              Budget Tracking
            </CardTitle>
            <CardDescription className="text-sm">
              Pantau pengeluaran berdasarkan kategori
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgets.map((budget) => {
                const percentage = (budget.spent / budget.budgeted) * 100;
                const isOverBudget = percentage > 100;

                return (
                  <div key={budget.category} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <span className="font-medium text-slate-800 text-sm">
                        {budget.category}
                      </span>
                      <span className="text-xs text-slate-500 mt-1 sm:mt-0">
                        Rp {budget.spent.toLocaleString("id-ID")} / Rp{" "}
                        {budget.budgeted.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isOverBudget
                            ? "bg-red-500"
                            : percentage > 80
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span
                        className={`${
                          isOverBudget ? "text-red-600" : "text-slate-500"
                        }`}
                      >
                        {percentage.toFixed(0)}% terpakai
                      </span>
                      <span className="text-slate-500">
                        Sisa: Rp {(budget.budgeted - budget.spent).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>
      </div>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={ctx?.showPremiumModal || false}
        onClose={() => ctx?.setShowPremiumModal(false)}
        feature="Finance Management & Analytics"
      />
    </div>
  );
}