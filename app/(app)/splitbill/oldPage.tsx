"use client";

import React from "react";

import { useState } from "react";
import { cn } from "@/lib/utils";
import LayoutContext from "@/context/layout-context";
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
import { Badge } from "@/components/ui/badge";
import ComingSoonOverlay from "@/components/coming-soon-overlay";
import {
  Upload,
  Plus,
  X,
  Receipt,
  Users,
  DollarSign,
  Crown,
  Share,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[];
}

interface Person {
  id: string;
  name: string;
}

export default function SplitBillPage() {
  const [step, setStep] = useState(1);
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [otherCharges, setOtherCharges] = useState({
    tax: 0,
    service: 0,
    tip: 0,
  });
  // const [showPremiumModal, setShowPremiumModal] = useState(false);

  const ctx = React.useContext(LayoutContext);

  // Mock OCR data
  const mockOCRData = [
    { id: "1", name: "Nasi Goreng", price: 25000 },
    { id: "2", name: "Ayam Bakar", price: 35000 },
    { id: "3", name: "Es Teh Manis", price: 8000 },
    { id: "4", name: "Soto Ayam", price: 20000 },
    { id: "5", name: "Jus Jeruk", price: 12000 },
  ];

  const addPerson = () => {
    if (newPersonName.trim()) {
      setPeople([
        ...people,
        { id: Date.now().toString(), name: newPersonName.trim() },
      ]);
      setNewPersonName("");
    }
  };

  const removePerson = (id: string) => {
    setPeople(people.filter((p) => p.id !== id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setTimeout(() => {
        setMenuItems(mockOCRData.map((item) => ({ ...item, assignedTo: [] })));
        setOtherCharges({ tax: 5000, service: 3000, tip: 0 });
        setStep(2);
      }, 2000);
    }
  };

  const togglePersonForItem = (itemId: string, personId: string) => {
    setMenuItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          const isAssigned = item.assignedTo.includes(personId);
          return {
            ...item,
            assignedTo: isAssigned
              ? item.assignedTo.filter((id) => id !== personId)
              : [...item.assignedTo, personId],
          };
        }
        return item;
      })
    );
  };

  const calculateSplit = () => {
    const results = people.map((person) => {
      const assignedItems = menuItems.filter((item) =>
        item.assignedTo.includes(person.id)
      );
      const itemsTotal = assignedItems.reduce(
        (sum, item) => sum + item.price / item.assignedTo.length,
        0
      );
      const chargesPerPerson =
        (otherCharges.tax + otherCharges.service + otherCharges.tip) /
        people.length;
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
      };
    });
    return results;
  };

  const splitResults = step === 4 ? calculateSplit() : [];

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return <Upload className="w-5 h-5" />;
      case 2:
        return <Users className="w-5 h-5" />;
      case 3:
        return <Receipt className="w-5 h-5" />;
      case 4:
        return <DollarSign className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleShareBill = (result: any) => {
    // Create shareable content
    const shareText = `
🧾 *Tagihan ${result.person}*

${result.items
  .map(
    (item: any) =>
      `• ${item.name} ${
        item.sharedWith > 1 ? `(dibagi ${item.sharedWith})` : ""
      }: Rp ${item.price.toLocaleString()}`
  )
  .join("\n")}

💰 *Biaya tambahan*: Rp ${result.charges.toLocaleString()}
💳 *Total*: Rp ${result.total.toLocaleString()}

Dibuat dengan LihatBill 📱
  `.trim();

    // Share via Web Share API or fallback to copy
    if (navigator.share) {
      navigator
        .share({
          title: `Tagihan ${result.person}`,
          text: shareText,
        })
        .catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          // You could show a toast notification here
          alert("Link tagihan berhasil disalin!");
        })
        .catch(() => {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = shareText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          alert("Link tagihan berhasil disalin!");
        });
    }
  };

  return (
    <div
      className={cn(
        ctx?.isSidebarCollapsed ? "ml-20" : "ml-72",
        "p-6 relative z-10 transition-all duration-200"
      )}
    >
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <h1 className="text-4xl font-bold text-slate-800 font-display">
          SplitBill
        </h1>
      </div>

      {/* Premium Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-modern border-0 relative overflow-hidden">
          <div className="absolute top-3 right-3 z-10">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <CardHeader className="relative z-10 opacity-50">
            <CardTitle className="text-sm font-medium text-slate-600 font-body">
              Total Bills
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Receipt className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 opacity-50">
            <div className="text-3xl font-bold text-slate-800 mb-1 font-display">
              12
            </div>
            <p className="text-sm text-slate-500 font-body">Bills diupload</p>
          </CardContent>
          <ComingSoonOverlay />
        </Card>

        <Card className="card-modern border-0 relative overflow-hidden">
          <div className="absolute top-3 right-3 z-10">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <CardHeader className="relative z-10 opacity-50">
            <CardTitle className="text-sm font-medium text-slate-600 font-body">
              Total Amount
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 opacity-50">
            <div className="text-3xl font-bold text-slate-800 mb-1 font-display">
              Rp 2.450.000
            </div>
            <p className="text-sm text-slate-500 font-body">
              Total semua bills
            </p>
          </CardContent>
          <ComingSoonOverlay />
        </Card>

        <Card className="card-modern border-0 relative overflow-hidden">
          <div className="absolute top-3 right-3 z-10">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-5"></div>
          <CardHeader className="relative z-10 opacity-50">
            <CardTitle className="text-sm font-medium text-slate-600 font-body">
              Completed
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 opacity-50">
            <div className="text-3xl font-bold text-slate-800 mb-1 font-display">
              8
            </div>
            <p className="text-sm text-slate-500 font-body">Bills selesai</p>
          </CardContent>
          <ComingSoonOverlay />
        </Card>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <Button
                className={`w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300 ${
                  step >= stepNumber
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {getStepIcon(stepNumber)}
              </Button>
              {stepNumber < 4 && (
                <div
                  className={`w-16 h-1 mx-3 transition-all duration-300 ${
                    step > stepNumber
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <Card className="card-modern border-0 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center gap-3 font-display text-2xl">
              <Upload className="w-7 h-7 text-primary-600" />
              Upload Struk
            </CardTitle>
            <CardDescription className="font-body text-base">
              Upload foto struk untuk diproses secara otomatis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-16 text-center hover:border-primary-400 transition-colors">
              <Upload className="w-20 h-20 mx-auto mb-8 text-slate-400" />
              <p className="text-slate-600 mb-8 text-lg font-body">
                Drag & drop atau klik untuk upload struk
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload">
                <Button
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 px-10 py-4 rounded-xl font-display font-semibold btn-modern"
                  asChild
                >
                  <span>Pilih File</span>
                </Button>
              </Label>
              {uploadedFile && (
                <div className="mt-10 p-8 bg-slate-50 rounded-2xl">
                  <Receipt className="w-10 h-10 mx-auto mb-4 text-primary-600" />
                  <p className="text-slate-700 font-medium font-body text-lg">
                    Memproses: {uploadedFile.name}
                  </p>
                  <div className="w-full bg-slate-200 rounded-full h-4 mt-6">
                    <div
                      className="bg-gradient-to-r from-accent-500 to-accent-600 h-4 rounded-full animate-pulse transition-all duration-1000"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="card-modern border-0 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center gap-3 font-display text-2xl">
              <Users className="w-7 h-7 text-primary-600" />
              Tambah Nama Orang
            </CardTitle>
            <CardDescription className="font-body text-base">
              Masukkan nama semua orang yang akan berbagi tagihan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-3">
              <Input
                placeholder="Masukkan nama..."
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addPerson()}
                className="border-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-xl h-12 font-body"
              />
              <Button
                onClick={addPerson}
                className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 px-8 rounded-xl btn-modern"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              {people.map((person) => (
                <Badge
                  key={person.id}
                  variant="secondary"
                  className="bg-primary-100 text-primary-700 px-4 py-2 text-sm rounded-full hover:bg-primary-200 transition-colors font-body"
                >
                  {person.name}
                  <X
                    className="w-4 h-4 ml-2 cursor-pointer hover:text-red-600 transition-colors"
                    onClick={() => removePerson(person.id)}
                  />
                </Badge>
              ))}
            </div>

            <Button
              onClick={() => setStep(3)}
              disabled={people.length < 2}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-display font-semibold py-4 rounded-xl btn-modern shadow-xl"
            >
              Lanjut ke Bagi Bill ({people.length} orang)
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="card-modern border-0 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center gap-3 font-display text-2xl">
              <Receipt className="w-7 h-7 text-primary-600" />
              Pilih Siapa yang Pesan Apa
            </CardTitle>
            <CardDescription className="font-body text-base">
              Klik nama orang untuk menandai siapa yang memesan item tersebut
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-2xl p-6 glass-effect"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-slate-800 text-xl font-display">
                    {item.name}
                  </h3>
                  <span className="text-accent-600 font-bold text-xl font-display">
                    Rp {item.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {people.map((person) => (
                    <Badge
                      key={person.id}
                      variant={
                        item.assignedTo.includes(person.id)
                          ? "default"
                          : "outline"
                      }
                      className={`cursor-pointer px-6 py-3 text-sm rounded-full transition-all duration-200 font-body ${
                        item.assignedTo.includes(person.id)
                          ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:shadow-xl"
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

            <div className="border border-accent-300 rounded-2xl p-6 bg-gradient-to-r from-accent-50 to-yellow-50">
              <h3 className="font-semibold text-slate-800 mb-6 text-xl font-display">
                Biaya Tambahan
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label className="text-slate-700 font-medium font-body">
                    Pajak
                  </Label>
                  <Input
                    type="number"
                    value={otherCharges.tax}
                    onChange={(e) =>
                      setOtherCharges({
                        ...otherCharges,
                        tax: Number(e.target.value),
                      })
                    }
                    className="mt-2 border-slate-300 focus:border-accent-500 focus:ring-accent-500 rounded-xl h-12 font-body"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-medium font-body">
                    Service
                  </Label>
                  <Input
                    type="number"
                    value={otherCharges.service}
                    onChange={(e) =>
                      setOtherCharges({
                        ...otherCharges,
                        service: Number(e.target.value),
                      })
                    }
                    className="mt-2 border-slate-300 focus:border-accent-500 focus:ring-accent-500 rounded-xl h-12 font-body"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-medium font-body">
                    Tip
                  </Label>
                  <Input
                    type="number"
                    value={otherCharges.tip}
                    onChange={(e) =>
                      setOtherCharges({
                        ...otherCharges,
                        tip: Number(e.target.value),
                      })
                    }
                    className="mt-2 border-slate-300 focus:border-accent-500 focus:ring-accent-500 rounded-xl h-12 font-body"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep(4)}
              className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-display font-semibold py-4 rounded-xl btn-modern shadow-xl"
            >
              Split Bill
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <Card className="card-modern border-0">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-3 font-display text-2xl">
                <DollarSign className="w-7 h-7 text-primary-600" />
                Summary Split Bill
              </CardTitle>
              <CardDescription className="font-body text-base">
                Berikut adalah rincian pembagian tagihan untuk setiap orang
              </CardDescription>
            </CardHeader>
          </Card>

          {splitResults.map((result, index) => (
            <Card key={index} className="card-modern border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-4 font-display">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                      {result.person.charAt(0)}
                    </div>
                    {result.person}
                  </CardTitle>
                  <Button
                    onClick={() => handleShareBill(result)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-body btn-modern"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm py-3 border-b border-slate-100"
                    >
                      <span className="text-slate-700 font-body">
                        {item.name}{" "}
                        {item.sharedWith > 1 && `(dibagi ${item.sharedWith})`}
                      </span>
                      <span className="font-medium text-slate-800 font-display">
                        Rp {item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-body">
                      Biaya tambahan
                    </span>
                    <span className="font-medium text-slate-700 font-display">
                      Rp {result.charges.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-xl pt-4 border-t-2 border-accent-200">
                    <span className="text-slate-800 font-display">Total</span>
                    <span className="text-accent-600 font-display">
                      Rp {result.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-4">
            <Button
              onClick={() => {
                setStep(1);
                setPeople([]);
                setMenuItems([]);
                setUploadedFile(null);
                setOtherCharges({ tax: 0, service: 0, tip: 0 });
              }}
              variant="outline"
              className="flex-1 glass-effect border-slate-200/50 hover:bg-white/80 font-body btn-modern py-4"
            >
              Split Bill Lagi
            </Button>
            <Button
              onClick={() => ctx?.setShowPremiumModal(true)}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-semibold py-4 rounded-xl btn-modern shadow-xl"
            >
              <Crown className="w-4 h-4 mr-2" />
              Simpan ke Riwayat (Pro)
            </Button>
          </div>
        </div>
      )}

      {/* Premium History Section */}
      <Card className="card-modern border-0 mt-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-10"></div>
        <div className="absolute top-4 right-4 z-20">
          {/* <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 border-0">
              <Crown className="w-4 h-4 mr-1" />
              PRO FEATURE
            </Badge> */}
        </div>
        <CardHeader className="relative z-10 opacity-50">
          <CardTitle className="text-slate-800 flex items-center gap-3 font-display text-2xl">
            <Receipt className="w-7 h-7 text-slate-600" />
            Riwayat Split Bill
          </CardTitle>
          <CardDescription className="font-body">
            Lihat semua riwayat split bill yang pernah dibuat
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 opacity-50">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 font-display">
                      Resto Padang Sederhana
                    </h3>
                    <p className="text-sm text-slate-500 font-body">
                      20 Jan 2024 • 4 orang
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800 font-display">
                    Rp 320.000
                  </p>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                    Selesai
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <ComingSoonOverlay />
        {/* <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 font-display mb-2">
                Premium Feature
              </h3>
              <p className="text-slate-600 font-body mb-4 max-w-sm">
                Simpan dan kelola riwayat split bill Anda dengan fitur Pro
              </p>
              <Button
                onClick={() => setShowPremiumModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-semibold px-6 py-3 rounded-xl btn-modern shadow-xl"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </div>
          </div> */}
      </Card>
    </div>
  );
}
