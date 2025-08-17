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
  serviceCharge: number; // Added serviceCharge field
  total: number;
  restaurant: string;
};

export default function SplitBillApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [receiptImage, setReceiptImage] = useState<string | null>(null); // Added receiptImage state
  const [people, setPeople] = useState<Person[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 1, title: "Upload Receipt", icon: Upload, completed: !!receiptData },
    { id: 2, title: "Add People", icon: Users, completed: people.length > 0 },
    { id: 3, title: "Assign Items", icon: Calculator, completed: false },
    { id: 4, title: "Split Bill", icon: Receipt, completed: false },
  ];

  const handleReceiptProcessed = (data: ReceiptData, imageUrl?: string) => {
    // Added imageUrl parameter
    setReceiptData(data);
    if (imageUrl) setReceiptImage(imageUrl); // Set receipt image
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
    setReceiptImage(null); // Reset receipt image
    setPeople([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Split Bill</h1>
          <p className="text-gray-600">
            Upload receipt, add friends, split the bill easily
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                    currentStep >= step.id
                      ? "bg-blue-600 border-blue-600 text-white"
                      : step.completed
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {step.icon && <step.icon className="w-5 h-5" />}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 ml-4 ${
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
                receiptImage={receiptImage || undefined} // Pass receiptImage to MenuAssignment
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
