"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  Share2,
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
  const { calculation, stats, paymentInstructions, exportData } =
    useSplitCalculator(receiptData, people);
  const { toast } = useToast();

  if (!calculation || !stats || !exportData) {
    return <div>Loading calculation...</div>;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-green-600">Split Complete!</h2>
        </div>
        <p className="text-gray-600">Here's how much everyone needs to pay</p>
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Receipt className="w-5 h-5" />
            {receiptData.restaurant.store_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {stats.totalPeople}
                </span>
              </div>
              <p className="text-sm text-blue-800">People</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Receipt className="w-4 h-4 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {stats.totalItems}
                </span>
              </div>
              <p className="text-sm text-blue-800">Items</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span className="text-lg font-bold text-blue-600">
                  {SplitUtils.formatCurrency(stats.averagePerPerson)}
                </span>
              </div>
              <p className="text-sm text-blue-800">Average</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold text-blue-600">
                  {SplitUtils.formatCurrency(calculation.total)}
                </span>
              </div>
              <p className="text-sm text-blue-800">Total Bill</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Breakdowns */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Individual Breakdown</h3>
        {calculation.perPersonBreakdown.map((breakdown) => {
          const paymentText = createPaymentText(breakdown);

          return (
            <Card
              key={breakdown.person.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {breakdown.person.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {breakdown.person.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {breakdown.items.length} items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {SplitUtils.formatCurrency(breakdown.total)}
                    </div>
                    <Badge variant="secondary" className="text-xs text-white">
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
                  <h4 className="font-medium mb-2">Ordered Items</h4>
                  <div className="space-y-2">
                    {breakdown.items.map((item) => (
                      <div
                        key={`${item.id}-${breakdown.person.id}`}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {item.name} × {item.quantity}
                        </span>
                        <span>{SplitUtils.formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Cost Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{SplitUtils.formatCurrency(breakdown.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (proportional)</span>
                    <span>
                      {SplitUtils.formatCurrency(breakdown.taxAmount)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total to Pay</span>
                    <span className="text-lg">
                      {SplitUtils.formatCurrency(breakdown.total)}
                    </span>
                  </div>
                </div>

                {/* Copy Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(paymentText, breakdown.person.id)
                  }
                  className="w-full"
                >
                  {copiedPersonId === breakdown.person.id ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
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
          <CardTitle>Receipt Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{SplitUtils.formatCurrency(calculation.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{SplitUtils.formatCurrency(calculation.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{SplitUtils.formatCurrency(calculation.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex gap-3">
          {/* <Button onClick={shareResults} className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button> */}
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
                data: {
                  html,
                  styles: tailwindCSS,
                },
                responseType: "blob",
              })?.then((res) => {
                const url = URL.createObjectURL(res?.data);

                const link = document.createElement("a");
                link.download = "summary.png";
                link.href = url;
                link.click();
              });

              // if (componentRef.current) {
              //   const dataUrl = await toPng(componentRef.current, {
              //     cacheBust: true,
              //   });
              //   const link = document.createElement("a");
              //   link.download = "summary.png";
              //   link.href = dataUrl;
              //   link.click();
              // }
            }}
            className="flex-1 bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignment
          </Button>

          <Button variant="outline" onClick={onStartOver}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </div>
      </div>

      {/* <CardSummaryPrint
        people={people}
        receiptData={receiptData}
        ref={componentRef}
      /> */}
    </div>
  );
}
