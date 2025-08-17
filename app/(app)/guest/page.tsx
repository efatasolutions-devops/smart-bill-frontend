"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, Plus, X, ArrowLeft, Receipt, Users, Calculator } from "lucide-react"
import { useRouter } from "next/navigation"

interface MenuItem {
  id: string
  name: string
  price: number
  assignedTo: string[]
}

interface Person {
  id: string
  name: string
}

export default function GuestPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [people, setPeople] = useState<Person[]>([])
  const [newPersonName, setNewPersonName] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [otherCharges, setOtherCharges] = useState({ tax: 0, service: 0, tip: 0 })

  // Mock OCR data
  const mockOCRData = [
    { id: "1", name: "Nasi Goreng", price: 25000 },
    { id: "2", name: "Ayam Bakar", price: 35000 },
    { id: "3", name: "Es Teh Manis", price: 8000 },
    { id: "4", name: "Soto Ayam", price: 20000 },
    { id: "5", name: "Jus Jeruk", price: 12000 },
  ]

  const addPerson = () => {
    if (newPersonName.trim()) {
      setPeople([...people, { id: Date.now().toString(), name: newPersonName.trim() }])
      setNewPersonName("")
    }
  }

  const removePerson = (id: string) => {
    setPeople(people.filter((p) => p.id !== id))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setTimeout(() => {
        setMenuItems(mockOCRData.map((item) => ({ ...item, assignedTo: [] })))
        setOtherCharges({ tax: 5000, service: 3000, tip: 0 })
        setStep(3)
      }, 2000)
    }
  }

  const togglePersonForItem = (itemId: string, personId: string) => {
    setMenuItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          const isAssigned = item.assignedTo.includes(personId)
          return {
            ...item,
            assignedTo: isAssigned ? item.assignedTo.filter((id) => id !== personId) : [...item.assignedTo, personId],
          }
        }
        return item
      }),
    )
  }

  const calculateSplit = () => {
    const results = people.map((person) => {
      const assignedItems = menuItems.filter((item) => item.assignedTo.includes(person.id))
      const itemsTotal = assignedItems.reduce((sum, item) => sum + item.price / item.assignedTo.length, 0)
      const chargesPerPerson = (otherCharges.tax + otherCharges.service + otherCharges.tip) / people.length
      return {
        person: person.name,
        items: assignedItems.map((item) => ({
          name: item.name,
          price: item.price / item.assignedTo.length,
          sharedWith: item.assignedTo.length,
        })),
        itemsTotal,
        charges: chargesPerPerson,
        total: itemsTotal + chargesPerPerson,
      }
    })
    return results
  }

  const splitResults = step === 4 ? calculateSplit() : []

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return <Users className="w-5 h-5" />
      case 2:
        return <Upload className="w-5 h-5" />
      case 3:
        return <Receipt className="w-5 h-5" />
      case 4:
        return <Calculator className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
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
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Guest Mode</h1>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepNumber
                      ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {getStepIcon(stepNumber)}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step > stepNumber ? "bg-gradient-to-r from-primary-600 to-secondary-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-3">
                <Users className="w-6 h-6 text-primary-600" />
                Tambah Nama Orang
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Masukkan nama..."
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addPerson()}
                  className="border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                />
                <Button
                  onClick={addPerson}
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 px-6 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                {people.map((person) => (
                  <Badge
                    key={person.id}
                    variant="secondary"
                    className="bg-primary-100 text-primary-700 px-4 py-2 text-sm rounded-full hover:bg-primary-200 transition-colors"
                  >
                    {person.name}
                    <X
                      className="w-3 h-3 ml-2 cursor-pointer hover:text-red-600"
                      onClick={() => removePerson(person.id)}
                    />
                  </Badge>
                ))}
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={people.length < 2}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Lanjut ke Upload Struk ({people.length} orang)
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-3">
                <Upload className="w-6 h-6 text-primary-600" />
                Upload Struk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-primary-400 transition-colors">
                <Upload className="w-16 h-16 mx-auto mb-6 text-slate-400" />
                <p className="text-slate-600 mb-6 text-lg">Drag & drop atau klik untuk upload struk</p>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <Label htmlFor="file-upload">
                  <Button
                    className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 px-8 py-3 rounded-lg font-medium"
                    asChild
                  >
                    <span>Pilih File</span>
                  </Button>
                </Label>
                {uploadedFile && (
                  <div className="mt-8 p-6 bg-slate-50 rounded-xl">
                    <Receipt className="w-8 h-8 mx-auto mb-3 text-primary-600" />
                    <p className="text-slate-700 font-medium">Memproses: {uploadedFile.name}</p>
                    <div className="w-full bg-slate-200 rounded-full h-3 mt-4">
                      <div
                        className="bg-gradient-to-r from-accent-500 to-accent-600 h-3 rounded-full animate-pulse"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Continue with steps 3 and 4 with similar modern styling... */}
        {step === 3 && (
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-3">
                <Receipt className="w-6 h-6 text-primary-600" />
                Pilih Siapa yang Pesan Apa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {menuItems.map((item) => (
                <div key={item.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-800 text-lg">{item.name}</h3>
                    <span className="text-accent-600 font-bold text-lg">Rp {item.price.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {people.map((person) => (
                      <Badge
                        key={person.id}
                        variant={item.assignedTo.includes(person.id) ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                          item.assignedTo.includes(person.id)
                            ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg"
                            : "border-slate-300 text-slate-600 hover:bg-slate-100"
                        }`}
                        onClick={() => togglePersonForItem(item.id, person.id)}
                      >
                        {person.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border border-accent-300 rounded-xl p-6 bg-gradient-to-r from-accent-50 to-yellow-50">
                <h3 className="font-semibold text-slate-800 mb-4 text-lg">Biaya Tambahan</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Pajak</Label>
                    <Input
                      type="number"
                      value={otherCharges.tax}
                      onChange={(e) => setOtherCharges({ ...otherCharges, tax: Number(e.target.value) })}
                      className="mt-2 border-slate-300 focus:border-accent-500 focus:ring-accent-500 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Service</Label>
                    <Input
                      type="number"
                      value={otherCharges.service}
                      onChange={(e) => setOtherCharges({ ...otherCharges, service: Number(e.target.value) })}
                      className="mt-2 border-slate-300 focus:border-accent-500 focus:ring-accent-500 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Tip</Label>
                    <Input
                      type="number"
                      value={otherCharges.tip}
                      onChange={(e) => setOtherCharges({ ...otherCharges, tip: Number(e.target.value) })}
                      className="mt-2 border-slate-300 focus:border-accent-500 focus:ring-accent-500 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(4)}
                className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Split Bill
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-3">
                  <Calculator className="w-6 h-6 text-primary-600" />
                  Summary Split Bill
                </CardTitle>
              </CardHeader>
            </Card>

            {splitResults.map((result, index) => (
              <Card
                key={index}
                className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold">
                      {result.person.charAt(0)}
                    </div>
                    {result.person}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-2 border-b border-slate-100">
                        <span className="text-slate-700">
                          {item.name} {item.sharedWith > 1 && `(dibagi ${item.sharedWith})`}
                        </span>
                        <span className="font-medium text-slate-800">Rp {item.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                      <span className="text-slate-600">Biaya tambahan</span>
                      <span className="font-medium text-slate-700">Rp {result.charges.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-3 border-t-2 border-accent-200">
                      <span className="text-slate-800">Total</span>
                      <span className="text-accent-600">Rp {result.total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={() => router.push("/")}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Selesai
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
