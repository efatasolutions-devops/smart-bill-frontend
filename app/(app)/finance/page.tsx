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
        ctx?.isSidebarCollapsed ? "ml-20" : "ml-72",
        "p-6 relative z-10 transition-all duration-200"
      )}
    >
      {/* Header with Premium Badge */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-4xl font-bold text-slate-800 font-display">
            Finance
          </h1>
          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 border-0">
            <Crown className="w-4 h-4 mr-1" />
            PRO FEATURE
          </Badge>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="card-modern border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 font-body">
              Total Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 font-display">
              Rp {totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 font-body">Bulan ini</p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>

        <Card className="card-modern border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 font-body">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 font-display">
              Rp {totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 font-body">Bulan ini</p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>

        <Card className="card-modern border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 font-body">
              Net Income
            </CardTitle>
            <DollarSign className="h-4 w-4 text-accent-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold font-display ${
                netIncome >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Rp {netIncome.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 font-body">Sisa bulan ini</p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>

        <Card className="card-modern border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 font-body">
              Budget Usage
            </CardTitle>
            <Target className="h-4 w-4 text-accent-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 font-display">
              {budgetUsage}%
            </div>
            <p className="text-xs text-slate-500 font-body">
              Dari total budget
            </p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <ComingSoonOverlay />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <Card className="card-modern border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-slate-800 font-display">
                Transaksi Terbaru
              </CardTitle>
              <div className="relative">
                <Button
                  onClick={handleAddTransaction}
                  size="sm"
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 font-body btn-modern"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah
                </Button>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border border-slate-200/50 rounded-xl glass-effect"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
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
                      <p className="font-medium text-slate-800 font-body">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-slate-500 font-body">
                        {new Date(transaction.date).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold font-display ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}Rp{" "}
                      {transaction.amount.toLocaleString()}
                    </p>
                    <Badge variant="outline" className="text-xs font-body">
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
        <Card className="card-modern border-0">
          <CardHeader>
            <CardTitle className="text-slate-800 font-display">
              Budget Tracking
            </CardTitle>
            <CardDescription className="font-body">
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
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-800 font-body">
                        {budget.category}
                      </span>
                      <span className="text-sm text-slate-500 font-body">
                        Rp {budget.spent.toLocaleString()} / Rp{" "}
                        {budget.budgeted.toLocaleString()}
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
                        className={`font-body ${
                          isOverBudget ? "text-red-600" : "text-slate-500"
                        }`}
                      >
                        {percentage.toFixed(0)}% terpakai
                      </span>
                      <span className="text-slate-500 font-body">
                        Sisa: Rp{" "}
                        {(budget.budgeted - budget.spent).toLocaleString()}
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
    </div>
  );
}
