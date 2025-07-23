"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Upload, Plus, X, Receipt, Users, DollarSign, Eye, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface BillHistory {
  id: string
  date: string
  restaurant: string
  total: number
  people: number
  status: "completed" | "pending"
  items: BillItem[]
  participants: string[]
}

interface BillItem {
  id: string
  name: string
  price: number
  assignedTo: string[]
}

export default function SplitBillPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [people, setPeople] = useState<string[]>([])
  const [newPersonName, setNewPersonName] = useState("")
  const [selectedBill, setSelectedBill] = useState<BillHistory | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBill, setEditingBill] = useState<BillHistory | null>(null)

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

  // Mock bill history data with detailed items
  const [billHistory, setBillHistory] = useState<BillHistory[]>([
    {
      id: "1",
      date: "2024-01-20",
      restaurant: "Resto Padang Sederhana",
      total: 320000,
      people: 4,
      status: "completed",
      participants: ["Alice", "Bob", "Charlie", "Diana"],
      items: [
        { id: "1", name: "Nasi Padang", price: 25000, assignedTo: ["Alice", "Bob"] },
        { id: "2", name: "Rendang", price: 45000, assignedTo: ["Charlie"] },
        { id: "3", name: "Ayam Pop", price: 35000, assignedTo: ["Diana"] },
        { id: "4", name: "Es Teh", price: 8000, assignedTo: ["Alice", "Bob", "Charlie", "Diana"] },
      ],
    },
    {
      id: "2",
      date: "2024-01-18",
      restaurant: "Warung Makan Bu Tini",
      total: 150000,
      people: 3,
      status: "completed",
      participants: ["Alice", "Bob", "Eve"],
      items: [
        { id: "1", name: "Gado-gado", price: 20000, assignedTo: ["Alice"] },
        { id: "2", name: "Soto Ayam", price: 25000, assignedTo: ["Bob"] },
        { id: "3", name: "Nasi Gudeg", price: 22000, assignedTo: ["Eve"] },
      ],
    },
    {
      id: "3",
      date: "2024-01-15",
      restaurant: "Cafe Kopi Hitam",
      total: 85000,
      people: 2,
      status: "pending",
      participants: ["Alice", "Frank"],
      items: [
        { id: "1", name: "Americano", price: 25000, assignedTo: ["Alice"] },
        { id: "2", name: "Latte", price: 30000, assignedTo: ["Frank"] },
        { id: "3", name: "Croissant", price: 15000, assignedTo: ["Alice", "Frank"] },
      ],
    },
  ])

  const totalBills = billHistory.length
  const totalAmount = billHistory.reduce((sum, bill) => sum + bill.total, 0)
  const completedBills = billHistory.filter((bill) => bill.status === "completed").length

  const addPerson = () => {
    if (newPersonName.trim() && !people.includes(newPersonName.trim())) {
      setPeople([...people, newPersonName.trim()])
      setNewPersonName("")
    }
  }

  const removePerson = (name: string) => {
    setPeople(people.filter((p) => p !== name))
  }

  const handleViewDetail = (bill: BillHistory) => {
    setSelectedBill(bill)
    setShowDetailModal(true)
  }

  const handleEdit = (bill: BillHistory) => {
    setEditingBill({ ...bill })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (editingBill) {
      setBillHistory((prev) => prev.map((bill) => (bill.id === editingBill.id ? editingBill : bill)))
      setShowEditModal(false)
      setEditingBill(null)
    }
  }

  const handleDelete = (billId: string) => {
    setBillHistory((prev) => prev.filter((bill) => bill.id !== billId))
  }

  const calculatePersonTotal = (bill: BillHistory, person: string) => {
    return bill.items.reduce((sum, item) => {
      if (item.assignedTo.includes(person)) {
        return sum + item.price / item.assignedTo.length
      }
      return sum
    }, 0)
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
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <Link href="/splitbill" className="px-4 py-2 text-primary-600 font-medium bg-primary-50 rounded-lg">
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Bills</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Receipt className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-1">{totalBills}</div>
              <p className="text-sm text-slate-500">Bills diupload</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Amount</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-1">Rp {totalAmount.toLocaleString()}</div>
              <p className="text-sm text-slate-500">Total semua bills</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-1">{completedBills}</div>
              <p className="text-sm text-slate-500">Bills selesai</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload New Bill */}
        <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              Upload Bill Baru
            </CardTitle>
            <CardDescription>Upload struk dan bagi dengan teman-teman</CardDescription>
          </CardHeader>
          <CardContent>
            {!showUploadForm ? (
              <Button
                onClick={() => setShowUploadForm(true)}
                className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Bill Baru
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tambah Orang</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Masukkan nama..."
                      value={newPersonName}
                      onChange={(e) => setNewPersonName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addPerson()}
                      className="border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                    />
                    <Button
                      onClick={addPerson}
                      size="sm"
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {people.map((person) => (
                      <Badge
                        key={person}
                        variant="secondary"
                        className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full"
                      >
                        {person}
                        <X
                          className="w-3 h-3 ml-2 cursor-pointer hover:text-red-600"
                          onClick={() => removePerson(person)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-primary-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 mb-4">Drag & drop atau klik untuk upload struk</p>
                  <input type="file" accept="image/*" className="hidden" id="file-upload" />
                  <Label htmlFor="file-upload">
                    <Button
                      className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700"
                      asChild
                    >
                      <span>Pilih File</span>
                    </Button>
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowUploadForm(false)}
                    variant="outline"
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    Batal
                  </Button>
                  <Button
                    disabled={people.length < 2}
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                  >
                    Proses Bill
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bill History with CRUD Actions */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              Riwayat Split Bill
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {billHistory.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleViewDetail(bill)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{bill.restaurant}</h3>
                      <p className="text-sm text-slate-500">{new Date(bill.date).toLocaleDateString("id-ID")}</p>
                      <p className="text-xs text-slate-400">
                        {bill.items.length} items • {bill.participants.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">Rp {bill.total.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">{bill.people} orang</span>
                        <Badge
                          variant={bill.status === "completed" ? "default" : "secondary"}
                          className={
                            bill.status === "completed"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          }
                        >
                          {bill.status === "completed" ? "Selesai" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-300 hover:bg-slate-50 text-xs px-3 py-1 bg-transparent"
                        onClick={() => handleViewDetail(bill)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Detail
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-300 hover:bg-blue-50 text-blue-600 text-xs px-3 py-1 bg-transparent"
                        onClick={() => handleEdit(bill)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 hover:bg-red-50 text-red-600 text-xs px-3 py-1 bg-transparent"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Split Bill</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus split bill "{bill.restaurant}"? Tindakan ini tidak dapat
                              dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(bill.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Receipt className="w-6 h-6 text-primary-600" />
                Detail Split Bill - {selectedBill?.restaurant}
              </DialogTitle>
              <DialogDescription>
                {selectedBill?.date && new Date(selectedBill.date).toLocaleDateString("id-ID")} •{" "}
                {selectedBill?.participants.length} orang
              </DialogDescription>
            </DialogHeader>
            {selectedBill && (
              <div className="space-y-6">
                {/* Items */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Items</h3>
                  <div className="space-y-2">
                    {selectedBill.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-800">{item.name}</p>
                          <p className="text-sm text-slate-500">Dibagi: {item.assignedTo.join(", ")}</p>
                        </div>
                        <p className="font-semibold text-slate-800">Rp {item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Split Summary */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Split Summary</h3>
                  <div className="space-y-2">
                    {selectedBill.participants.map((person) => {
                      const total = calculatePersonTotal(selectedBill, person)
                      return (
                        <div key={person} className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                          <p className="font-medium text-slate-800">{person}</p>
                          <p className="font-semibold text-primary-600">Rp {total.toLocaleString()}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-slate-800">Total</p>
                    <p className="text-lg font-bold text-primary-600">Rp {selectedBill.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Edit className="w-6 h-6 text-blue-600" />
                Edit Split Bill
              </DialogTitle>
            </DialogHeader>
            {editingBill && (
              <div className="space-y-4">
                <div>
                  <Label>Nama Restoran</Label>
                  <Input
                    value={editingBill.restaurant}
                    onChange={(e) => setEditingBill({ ...editingBill, restaurant: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    value={editingBill.status}
                    onChange={(e) =>
                      setEditingBill({ ...editingBill, status: e.target.value as "completed" | "pending" })
                    }
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                    Simpan
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
