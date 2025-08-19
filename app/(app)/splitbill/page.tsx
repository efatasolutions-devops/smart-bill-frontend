"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Users, Calculator, Receipt } from "lucide-react";
import ReceiptUpload, {
  TTaxObjTotalResultOCR,
} from "@/components/receipt-upload";
import NameManager from "@/components/name-manager";
import MenuAssignment from "@/components/menu-assignment";
import SplitSummary from "@/components/split-summary";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Person = {
  id: string;
  name: string;
  items: MenuItem[];
  total: number;
};

export type ReceiptData = {
  items: MenuItem[];
  subtotal: number;
  tax: TTaxObjTotalResultOCR;
  serviceCharge: number;
  total: number;
  restaurant: string;
};

export default function SplitBillApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Definisi step dengan fungsi onClick
  const steps = [
    { id: 1, title: "Upload Receipt", icon: Upload },
    { id: 2, title: "Add People", icon: Users },
    { id: 3, title: "Assign Items", icon: Calculator },
    { id: 4, title: "Split Bill", icon: Receipt },
  ];

  const handleReceiptProcessed = (data: ReceiptData, imageUrl?: string) => {
    setReceiptData(data);
    if (imageUrl) setReceiptImage(imageUrl);
    setCurrentStep(2);
  };

  const handlePeopleAdded = (peopleList: Person[]) => {
    setPeople(peopleList);
    setCurrentStep(3);
  };

  const handleAssignmentComplete = (updatedPeople: Person[]) => {
    setPeople(updatedPeople);
    setCurrentStep(4);
  };

  const resetApp = () => {
    setCurrentStep(1);
    setReceiptData(null);
    setReceiptImage(null);
    setPeople([]);
    setIsProcessing(false);
  };

  // Fungsi untuk kembali ke step tertentu
  const goToStep = (stepId: number) => {
    // Cek apakah step valid
    if (stepId < 1 || stepId > steps.length) return;

    // Hanya bisa ke step yang sudah pernah dicapai
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Split Bill</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Upload receipt, add friends, split the bill easily
          </p>
        </div>

        {/* Progress Steps - Dapat diklik */}
        <div className="flex justify-center mb-6 overflow-x-auto pb-2">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200 ${
                    currentStep === step.id
                      ? "bg-blue-600 text-white"
                      : currentStep > step.id
                      ? "bg-blue-500/60 text-blue-800" // ✅ Warna diubah dari hijau ke biru muda
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <step.icon className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    {step.title}
                  </span>
                </button>

                {/* Garis pemisah antar step */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-6 h-0.5 ml-2 ${
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {(() => {
                const IconComponent = steps[currentStep - 1]?.icon;
                return IconComponent ? (
                  <IconComponent className="w-5 h-5" />
                ) : null;
              })()}
              {steps[currentStep - 1]?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <ReceiptUpload
                onReceiptProcessed={handleReceiptProcessed}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            )}

            {currentStep === 2 && receiptData && (
              <NameManager
                receiptData={receiptData}
                onPeopleAdded={handlePeopleAdded}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && receiptData && people.length > 0 && (
              <MenuAssignment
                receiptData={receiptData}
                receiptImage={receiptImage || undefined}
                people={people}
                onAssignmentComplete={handleAssignmentComplete}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && people.length > 0 && (
              <SplitSummary
                people={people}
                receiptData={receiptData!}
                onStartOver={resetApp}
                onBack={() => setCurrentStep(3)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}