"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Receipt, DollarSign, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ExpenseEvent {
  id: string
  date: string
  title: string
  amount: number
  category: string
  type: "income" | "expense"
}

export default function DashboardPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"monthly" | "weekly">("monthly")
  const [username, setUsername] = useState("")

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

  // Mock financial data with both income and expenses
  const transactions: ExpenseEvent[] = [
    { id: "1", date: "2024-01-15", title: "Makan di Resto A", amount: 150000, category: "Food", type: "expense" },
    { id: "2", date: "2024-01-16", title: "Belanja Groceries", amount: 250000, category: "Shopping", type: "expense" },
    { id: "3", date: "2024-01-16", title: "Kopi Pagi", amount: 25000, category: "Food", type: "expense" },
    { id: "4", date: "2024-01-16", title: "Freelance Payment", amount: 500000, category: "Work", type: "income" },
    { id: "5", date: "2024-01-18", title: "Nongkrong Cafe", amount: 85000, category: "Food", type: "expense" },
    { id: "6", date: "2024-01-18", title: "Bonus Project", amount: 300000, category: "Work", type: "income" },
    { id: "7", date: "2024-01-20", title: "Makan Siang Kantor", amount: 45000, category: "Food", type: "expense" },
    { id: "8", date: "2024-01-20", title: "Transport", amount: 35000, category: "Transport", type: "expense" },
    { id: "9", date: "2024-01-20", title: "Salary", amount: 1200000, category: "Work", type: "income" },
    { id: "10", date: "2024-01-22", title: "Dinner dengan Teman", amount: 320000, category: "Food", type: "expense" },
    { id: "11", date: "2024-01-22", title: "Movie Night", amount: 75000, category: "Entertainment", type: "expense" },
    { id: "12", date: "2024-01-22", title: "Side Project", amount: 400000, category: "Work", type: "income" },
    { id: "13", date: "2024-01-24", title: "Belanja Baju", amount: 180000, category: "Shopping", type: "expense" },
    {
      id: "14",
      date: "2024-01-24",
      title: "Investment Return",
      amount: 150000,
      category: "Investment",
      type: "income",
    },
  ]

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const avgExpense = totalExpenses / transactions.filter((t) => t.type === "expense").length
  const thisMonthTransactions = transactions.filter(
    (transaction) => new Date(transaction.date).getMonth() === currentDate.getMonth(),
  ).length

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const navigateDate = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (viewMode === "monthly") {
        if (direction === "prev") {
          newDate.setMonth(prev.getMonth() - 1)
        } else {
          newDate.setMonth(prev.getMonth() + 1)
        }
      } else {
        if (direction === "prev") {
          newDate.setDate(prev.getDate() - 7)
        } else {
          newDate.setDate(prev.getDate() + 7)
        }
      }
      return newDate
    })
  }

  const getTransactionsForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    return transactions.filter((transaction) => transaction.date === dateStr)
  }

  const renderMonthlyCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-36"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayTransactions = getTransactionsForDate(date)
      const dayIncome = dayTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
      const dayExpenses = dayTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div
          key={day}
          className={`h-36 border border-slate-200 p-2 bg-white hover:bg-slate-50 transition-colors rounded-lg ${
            isToday ? "ring-2 ring-primary-500 bg-primary-50" : ""
          }`}
        >
          <div className={`font-semibold text-sm mb-2 ${isToday ? "text-primary-700" : "text-slate-700"}`}>{day}</div>

          <div className="space-y-1 flex-1 overflow-hidden">
            {dayTransactions.slice(0, 2).map((transaction) => (
              <div
                key={transaction.id}
                className={`text-xs px-2 py-1 rounded-md border ${
                  transaction.type === "income"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-rose-100 text-rose-700 border-rose-200"
                }`}
                title={`${transaction.title} - Rp ${transaction.amount.toLocaleString()}`}
              >
                <div className="truncate font-medium">{transaction.title}</div>
                <div className="text-xs opacity-80">{(transaction.amount / 1000).toFixed(0)}k</div>
              </div>
            ))}
            {dayTransactions.length > 2 && (
              <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                +{dayTransactions.length - 2} lainnya
              </div>
            )}
          </div>

          {/* Daily Summary with Two Colors */}
          {(dayIncome > 0 || dayExpenses > 0) && (
            <div className="mt-2 pt-2 border-t border-slate-200 space-y-1">
              {dayIncome > 0 && (
                <div className="flex items-center justify-between">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="text-xs font-semibold text-emerald-600 flex-1 ml-2">
                    +{(dayIncome / 1000).toFixed(0)}k
                  </div>
                </div>
              )}
              {dayExpenses > 0 && (
                <div className="flex items-center justify-between">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  <div className="text-xs font-semibold text-rose-600 flex-1 ml-2">
                    -{(dayExpenses / 1000).toFixed(0)}k
                  </div>
                </div>
              )}
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  const renderWeeklyCalendar = () => {
    const weekDates = getWeekDates(currentDate)

    return weekDates.map((date, index) => {
      const dayTransactions = getTransactionsForDate(date)
      const dayIncome = dayTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
      const dayExpenses = dayTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
      const isToday = date.toDateString() === new Date().toDateString()

      return (
        <div
          key={index}
          className={`h-52 border border-slate-200 p-3 bg-white hover:bg-slate-50 transition-colors rounded-lg ${
            isToday ? "ring-2 ring-primary-500 bg-primary-50" : ""
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
              <div className={`font-semibold text-lg ${isToday ? "text-primary-700" : "text-slate-700"}`}>
                {date.getDate()}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {date.toLocaleDateString("id-ID", { weekday: "short" })}
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-hidden">
              {dayTransactions.slice(0, 3).map((transaction) => (
                <div
                  key={transaction.id}
                  className={`text-xs px-2 py-1.5 rounded-md border ${
                    transaction.type === "income"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : "bg-rose-100 text-rose-700 border-rose-200"
                  }`}
                  title={`${transaction.title} - Rp ${transaction.amount.toLocaleString()}`}
                >
                  <div className="truncate font-medium">{transaction.title}</div>
                  <div className="text-xs opacity-80 mt-0.5">
                    {transaction.type === "income" ? "+" : "-"}Rp {(transaction.amount / 1000).toFixed(0)}k
                  </div>
                </div>
              ))}
              {dayTransactions.length > 3 && (
                <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                  +{dayTransactions.length - 3} lainnya
                </div>
              )}
            </div>

            {/* Daily Summary with Two Colors */}
            {(dayIncome > 0 || dayExpenses > 0) && (
              <div className="mt-3 pt-2 border-t border-slate-200 space-y-1">
                {dayIncome > 0 && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <div className="text-sm font-semibold text-emerald-600">
                      Income: +{(dayIncome / 1000).toFixed(0)}k
                    </div>
                  </div>
                )}
                {dayExpenses > 0 && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-rose-500 rounded-full mr-2"></div>
                    <div className="text-sm font-semibold text-rose-600">
                      Expense: -{(dayExpenses / 1000).toFixed(0)}k
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )
    })
  }

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("username")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Navigation */}
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
                <Link href="/dashboard" className="px-4 py-2 text-primary-600 font-medium bg-primary-50 rounded-lg">
                  Dashboard
                </Link>
                <Link
                  href="/splitbill"
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  SplitBill
                </Link>
                <Link
                  href="/finance"
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
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
        {/* Modern Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Pengeluaran</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-1">Rp {totalExpenses.toLocaleString()}</div>
              <p className="text-sm text-slate-500">Bulan ini</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Pendapatan</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-1">Rp {totalIncome.toLocaleString()}</div>
              <p className="text-sm text-slate-500">Bulan ini</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Transaksi</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Receipt className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-1">{thisMonthTransactions}</div>
              <p className="text-sm text-slate-500">Transaksi tercatat</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Calendar */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-800">Kalender Keuangan</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    <span className="inline-flex items-center mr-4">
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
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "monthly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("monthly")}
                  className={
                    viewMode === "monthly"
                      ? "bg-primary-600 hover:bg-primary-700"
                      : "border-slate-300 hover:bg-slate-50"
                  }
                >
                  Monthly
                </Button>
                <Button
                  variant={viewMode === "weekly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("weekly")}
                  className={
                    viewMode === "weekly" ? "bg-primary-600 hover:bg-primary-700" : "border-slate-300 hover:bg-slate-50"
                  }
                >
                  Weekly
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={() => navigateDate("prev")}
                size="sm"
                className="border-slate-300 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold text-slate-800">
                {viewMode === "monthly"
                  ? currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })
                  : `${getWeekDates(currentDate)[0].toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - ${getWeekDates(currentDate)[6].toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`}
              </h3>
              <Button
                variant="outline"
                onClick={() => navigateDate("next")}
                size="sm"
                className="border-slate-300 hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "monthly" ? (
              <>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((day) => (
                    <div key={day} className="text-center font-semibold text-slate-600 py-3 text-sm">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">{renderMonthlyCalendar()}</div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((day) => (
                    <div key={day} className="text-center font-semibold text-slate-600 py-3 text-sm">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">{renderWeeklyCalendar()}</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
