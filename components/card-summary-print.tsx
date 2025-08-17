import { forwardRef, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { SplitUtils } from "@/lib/split-calculator";
import { Badge } from "./ui/badge";
import { Calculator, CheckCircle, Receipt, Users } from "lucide-react";
import { useSplitCalculator } from "@/hooks/use-split-calculator";

const CardSummaryPrint_ = ({ receiptData, people }, ref) => {
  const { calculation, stats } = useSplitCalculator(receiptData, people);

  return (
    <div ref={ref} className="bg-white space-y-6 mx-5 py-8 ">
      <p className="font-bold text-[#0365d0] text-3xl">
        Lihat<span className="text-[#019bfd]">Bill</span>
      </p>

      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-green-600">Split Complete!</h2>
        </div>
        <p className="text-gray-600">Here's how much everyone needs to pay</p>
      </div>

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
                  {stats?.totalPeople}
                </span>
              </div>
              <p className="text-sm text-blue-800">People</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Receipt className="w-4 h-4 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {stats?.totalItems}
                </span>
              </div>
              <p className="text-sm text-blue-800">Items</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span className="text-lg font-bold text-blue-600">
                  {SplitUtils.formatCurrency(stats?.averagePerPerson)}
                </span>
              </div>
              <p className="text-sm text-blue-800">Average</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold text-blue-600">
                  {SplitUtils.formatCurrency(calculation?.total)}
                </span>
              </div>
              <p className="text-sm text-blue-800">Total Bill</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Individual Breakdown</h3>
        {calculation?.perPersonBreakdown.map((breakdown) => {
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
                    <Badge variant="secondary" className="text-xs ">
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Receipt Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{SplitUtils.formatCurrency(calculation?.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{SplitUtils.formatCurrency(calculation?.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{SplitUtils.formatCurrency(calculation?.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-gray-600 text-center">
        Generated in app.lihatbill.com
      </p>
    </div>
  );
};

const CardSummaryPrint = memo(forwardRef(CardSummaryPrint_));
export default CardSummaryPrint;
