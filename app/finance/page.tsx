"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Target, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
}

interface Budget {
  category: string
  budgeted: number
  spent: number
}

export default function FinancePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "",
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const storedUsername = localStorage.getItem("username")

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [router])

  // Mock financial data
  const transactions: Transaction[] = [
    { id: "1", date: "2024-01-22", description: "Gaji Bulanan", amount: 8000000, type: "income", category: "Salary" },
    { id: "2", date: "2024-01-20", description: "Makan di Resto", amount: 150000, type: "expense", category: "Food" },
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
  ]

  const budgets: Budget[] = [
    { category: "Food", budgeted: 1000000, spent: 650000 },
    { category: "Shopping", budgeted: 500000, spent: 250000 },
    { category: "Transportation", budgeted: 300000, spent: 180000 },
    { category: "Entertainment", budgeted: 400000, spent: 320000 },
  ]

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netIncome = totalIncome - totalExpenses
  const totalBudget = budgets.reduce((sum, b) => sum + b.budgeted, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)

  const addTransaction = () => {
    if (newTransaction.description && newTransaction.amount && newTransaction.category) {
      // In a real app, this would save to a database
      console.log("Adding transaction:", newTransaction)
      setNewTransaction({ description: "", amount: "", type: "expense", category: "" })
      setShowAddTransaction(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("username")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Modern Navigation - Match Dashboard Style */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LB</span>
                </div>
                <h1 className="text-xl font-bold text-slate-800">LihatBill</h1>
              </div>
              <div className="flex space-x-1">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/splitbill"
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  SplitBill
                </Link>
                <Link href="/finance" className="px-4 py-2 text-primary-600 font-medium bg-primary-50 rounded-lg">
                  Finance
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-slate-600">
                Hi, <span className="font-medium text-slate-800">{username}</span>!
              </div>
              <Button variant="outline" onClick={logout} className="border-slate-300 hover:bg-slate-50 bg-transparent">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-600">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString()}</div>
              <p className="text-xs text-primary-500">Bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-600">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">Rp {totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-primary-500">Bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-600">Net Income</CardTitle>
              <DollarSign className="h-4 w-4 text-accent-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
                Rp {netIncome.toLocaleString()}
              </div>
              <p className="text-xs text-primary-500">Sisa bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-600">Budget Usage</CardTitle>
              <Target className="h-4 w-4 text-accent-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-700">
                {((totalSpent / totalBudget) * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-primary-500">Dari total budget</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-primary-700">Transaksi Terbaru</CardTitle>
                <Button
                  onClick={() => setShowAddTransaction(true)}
                  size="sm"
                  className="bg-accent-500 hover:bg-accent-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddTransaction && (
                <div className="mb-6 p-4 border border-primary-200 rounded-lg bg-primary-50">
                  <h3 className="font-semibold text-primary-700 mb-3">Tambah Transaksi</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Deskripsi</Label>
                      <Input
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        placeholder="Masukkan deskripsi..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Jumlah</Label>
                        <Input
                          type="number"
                          value={newTransaction.amount}
                          onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>Tipe</Label>
                        <Select
                          value={newTransaction.type}
                          onValueChange={(value: "income" | "expense") =>
                            setNewTransaction({ ...newTransaction, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Kategori</Label>
                      <Select
                        value={newTransaction.category}
                        onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Shopping">Shopping</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Salary">Salary</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addTransaction} size="sm" className="bg-primary-600 hover:bg-primary-700">
                        Simpan
                      </Button>
                      <Button onClick={() => setShowAddTransaction(false)} variant="outline" size="sm">
                        Batal
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border border-primary-100 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-primary-700">{transaction.description}</p>
                        <p className="text-sm text-primary-500">
                          {new Date(transaction.date).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}Rp {transaction.amount.toLocaleString()}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary-700">Budget Tracking</CardTitle>
              <CardDescription>Pantau pengeluaran berdasarkan kategori</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const percentage = (budget.spent / budget.budgeted) * 100
                  const isOverBudget = percentage > 100

                  return (
                    <div key={budget.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-primary-700">{budget.category}</span>
                        <span className="text-sm text-primary-500">
                          Rp {budget.spent.toLocaleString()} / Rp {budget.budgeted.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-primary-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isOverBudget ? "bg-red-500" : percentage > 80 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className={`${isOverBudget ? "text-red-600" : "text-primary-500"}`}>
                          {percentage.toFixed(0)}% terpakai
                        </span>
                        <span className="text-primary-500">
                          Sisa: Rp {(budget.budgeted - budget.spent).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
