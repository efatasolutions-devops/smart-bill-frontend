"use client";

import { useMemo } from "react";
import { SplitCalculator } from "@/lib/split-calculator";
import { Person, ReceiptData } from "@/app/(app)/splitbill/page";

export function useSplitCalculator(
  receiptData: ReceiptData | null,
  people: Person[]
) {
  const calculator = useMemo(() => {
    if (!receiptData || people.length === 0) return null;
    return new SplitCalculator(receiptData, people);
  }, [receiptData, people]);

  const calculation = useMemo(() => {
    if (!calculator) return null;
    return calculator.calculateSplit();
  }, [calculator]);

  const validation = useMemo(() => {
    if (!calculator) return { isValid: false, errors: [] };
    return calculator.validateAssignments();
  }, [calculator]);

  const stats = useMemo(() => {
    if (!calculator) return null;
    return calculator.getSummaryStats();
  }, [calculator]);

  const paymentInstructions = useMemo(() => {
    if (!calculator) return [];
    return calculator.generatePaymentInstructions();
  }, [calculator]);

  const exportData = useMemo(() => {
    if (!calculator) return null;
    return calculator.exportSplitData();
  }, [calculator]);

  return {
    calculator,
    calculation,
    validation,
    stats,
    paymentInstructions,
    exportData,
    isReady: !!calculator,
  };
}
