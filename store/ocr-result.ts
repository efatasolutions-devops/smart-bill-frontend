import { create } from "zustand";
import type { OcrResult } from "@/types/ocr-result";

export const useOcrResult = create<{ bill: OcrResult }>((set) => ({
  bill: {
    items: [],
    store_information: {},
    totals: {},
    transaction_information: {},
  },
}));
