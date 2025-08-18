"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileImage, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem, ReceiptData } from "@/app/(app)/splitbill/page";

interface ReceiptUploadProps {
  onReceiptProcessed: (data: ReceiptData, imageUrl?: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

type TStoreInfoResultOCR = {
  address: string | null;
  email: string | null;
  npwp: string | null;
  phone_number: string | null;
  store_name: string | null;
};

export type TTaxObjTotalResultOCR = {
  amount: string | null;
  dpp: string | null;
  name: string | null;
  service_charge: string | null;
  total_tax: number | null;
};

type TTotalsResultOCR = {
  change: string;
  discount: string;
  payment: string;
  subtotal: string;
  tax: TTaxObjTotalResultOCR;
  total: string;
};

type TTransactionInfoOCR = {
  date: string;
  time: string;
  transaction_id: string;
};

type TResultOCR = {
  items: MenuItem[];
  receipt_image_url: string;
  store_information: TStoreInfoResultOCR;
  totals: TTotalsResultOCR;
  transaction_information: TTransactionInfoOCR;
};

export default function ReceiptUpload({
  onReceiptProcessed,
  isProcessing,
  setIsProcessing,
}: ReceiptUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Mock OCR API call - in real app this would call your OCR service
  const processReceiptOCR = async (file: File): Promise<ReceiptData> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/splitbill/ocr", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to process OCR");
    }

    const data: TResultOCR = await res.json();

    return {
      restaurant: data.store_information?.store_name || "Unknown Restaurant",
      items:
        data?.items?.map((item, idx) => ({
          ...item,
          id: String(idx),
        })) || [],
      subtotal: Number(data?.totals?.subtotal) || 0,
      tax: {
        ...(data?.totals?.tax || {}),
        total_tax: Number(data?.totals?.tax?.total_tax),
      },
      serviceCharge: Number(data?.totals?.tax?.service_charge) || 0,
      total: Number(data?.totals?.total) || 0,
    };
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const receiptData = await processReceiptOCR(file);
      const imageUrl = URL.createObjectURL(file);

      toast({
        title: "Receipt processed successfully!",
        description: `Found ${receiptData.items.length} items from ${receiptData.restaurant}`,
      });

      onReceiptProcessed(receiptData, imageUrl);
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to process receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isProcessing ? "pointer-events-none opacity-70" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
          aria-label="Upload receipt"
        />

        <div className="space-y-3 sm:space-y-4">
          {isProcessing ? (
            <>
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto animate-spin" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Processing Receipt...
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Our AI is reading your receipt, please wait
                </p>
              </div>
            </>
          ) : uploadedFile ? (
            <>
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  File Ready
                </h3>
                <p className="text-gray-600 text-sm truncate max-w-xs mx-auto">
                  {uploadedFile.name}
                </p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Upload Receipt
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Drag and drop your receipt image here, or click to browse
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200 rounded-xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <FileImage className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">
                Tips for best results:
              </h4>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                <li>• Make sure the receipt is clearly visible and well-lit</li>
                <li>• Avoid shadows or reflections on the receipt</li>
                <li>• Supported formats: JPG, PNG, HEIC</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}