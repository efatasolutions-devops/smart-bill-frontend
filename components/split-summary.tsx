// components/split-summary.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  Receipt,
  Users,
  Calculator,
  Copy,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSplitCalculator } from "@/hooks/use-split-calculator";
import { PersonBreakdown, SplitUtils } from "@/lib/split-calculator";
import type { ReceiptData, Person } from "@/app/(app)/splitbill/page";
import ReactDOMServer from "react-dom/server";
import CardSummaryPrint from "./card-summary-print";
import axios from "axios";

// 🔽 Import Modal Feedback
import FeedbackModal from "./feedback-modal";

interface SplitSummaryProps {
  people: Person[];
  receiptData: ReceiptData;
  onStartOver: () => void;
  onBack: () => void;
}

export default function SplitSummary({
  people,
  receiptData,
  onStartOver,
  onBack,
}: SplitSummaryProps) {
  const [copiedPersonId, setCopiedPersonId] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const { calculation, stats, paymentInstructions, exportData } =
    useSplitCalculator(receiptData, people);
  const { toast } = useToast();

  // 🔁 Modal muncul SETIAP KALI halaman ini dirender (tanpa cek localStorage)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeedbackModal(true);
    }, 800); // Delay kecil agar tidak mengganggu UX

    return () => clearTimeout(timer);
  }, []);

  if (!calculation || !stats || !exportData) {
    return (
      <div className="text-center py-8 text-gray-500">Loading calculation...</div>
    );
  }

  const copyToClipboard = async (text: string, personId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (personId) {
        setCopiedPersonId(personId);
        setTimeout(() => setCopiedPersonId(null), 2000);
      }
      toast({
        title: "Copied to clipboard",
        description: "Payment details copied successfully",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const createPaymentText = (breakdownPerson: PersonBreakdown): string => {
    return `
    *${breakdownPerson?.person?.name}*

    Ordered Items:
    ${breakdownPerson?.items
      ?.map((item) => {
        return `- ${item?.name} x ${item?.quantity} = Rp${item?.price}`;
      })
      ?.join("\n\t")}

    Subtotal:
    Rp${breakdownPerson?.subtotal}

    Tax(proportional):
    Rp${breakdownPerson?.taxAmount}

    Total:
    Rp${breakdownPerson?.total}
    `;
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-green-600">
            Split Complete!
          </h2>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Here's how much everyone needs to pay
        </p>
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 text-sm sm:text-base">
            <Receipt className="w-5 h-5" />
            {receiptData.restaurant.store_name || "Receipt Summary"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xl font-bold text-blue-600">
                  {stats.totalPeople}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-800">People</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Receipt className="w-4 h-4 text-blue-600" />
                <span className="text-xl font-bold text-blue-600">
                  {stats.totalItems}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-800">Items</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span className="text-lg font-bold text-blue-600">
                  {SplitUtils.formatCurrency(stats.averagePerPerson)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-800">Average</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {SplitUtils.formatCurrency(calculation.total)}
              </div>
              <p className="text-xs sm:text-sm text-blue-800">Total Bill</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Breakdowns */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center sm:text-left">
          Individual Breakdown
        </h3>
        {calculation.perPersonBreakdown.map((breakdown) => {
          const paymentText = createPaymentText(breakdown);

          return (
            <Card
              key={breakdown.person.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {breakdown.person.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base font-semibold truncate">
                        {breakdown.person.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {breakdown.items.length} item{breakdown.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right sm:text-left mt-2 sm:mt-0">
                    <div className="text-xl font-bold">
                      {SplitUtils.formatCurrency(breakdown.total)}
                    </div>
                    <Badge variant="secondary" className="text-xs text-white px-2">
                      {SplitUtils.calculatePercentage(
                        breakdown.total,
                        calculation.total
                      ).toFixed(1)}
                      % of total
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items List */}
                <div>
                  <h4 className="font-medium text-sm">Ordered Items</h4>
                  <div className="space-y-1 mt-1">
                    {breakdown.items.map((item) => (
                      <div
                        key={`${item.id}-${breakdown.person.id}`}
                        className="flex justify-between text-xs"
                      >
                        <span className="text-gray-600 truncate max-w-[180px]">
                          {item.name} × {item.quantity}
                        </span>
                        <span>{SplitUtils.formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Cost Breakdown */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{SplitUtils.formatCurrency(breakdown.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Tax (proportional)</span>
                    <span>
                      {SplitUtils.formatCurrency(breakdown.taxAmount)}
                    </span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between font-semibold text-sm">
                    <span>Total to Pay</span>
                    <span>{SplitUtils.formatCurrency(breakdown.total)}</span>
                  </div>
                </div>

                {/* Copy Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(paymentText, breakdown.person.id)
                  }
                  className="w-full text-xs py-1"
                >
                  {copiedPersonId === breakdown.person.id ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy Payment Info
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Receipt Summary */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Receipt Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{SplitUtils.formatCurrency(calculation.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{SplitUtils.formatCurrency(calculation.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{SplitUtils.formatCurrency(calculation.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={async () => {
            const html = ReactDOMServer.renderToStaticMarkup(
              <CardSummaryPrint people={people} receiptData={receiptData} />
            );

            const res = await fetch(
              `${window.location?.origin}/_next/static/css/app/layout.css`
            );
            const tailwindCSS = await res.text();

            axios({
              method: "POST",
              url: "/api/download-summary",
              data: { html, styles: tailwindCSS },
              responseType: "blob",
            }).then((res) => {
              const url = URL.createObjectURL(res.data);
              const link = document.createElement("a");
              link.download = "splitbill-summary.png";
              link.href = url;
              link.click();
            });
          }}
          className="w-full flex items-center justify-center gap-2 py-2"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Download Summary</span>
        </Button>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 justify-center py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="text-sm">Back</span>
          </Button>

          <Button
            variant="outline"
            onClick={onStartOver}
            className="flex-1 justify-center py-2"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            <span className="text-sm">Start Over</span>
          </Button>
        </div>
      </div>

      {/* 🔽 Feedback Modal: Muncul setiap kali */}
      {showFeedbackModal && (
        <FeedbackModal onClose={() => setShowFeedbackModal(false)} />
      )}
    </div>
  );
}