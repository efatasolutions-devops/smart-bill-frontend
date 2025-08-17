// utils/buildSummaryPayload.ts
export function buildSummaryPayload(updatedPeople: any[], receiptData: any) {
  const totalValue = Number(
    getItemsSubtotal(receiptData.items) +
      (receiptData.serviceCharge || 0) +
      (receiptData.parkingFee || 0) +
      (receiptData.tax?.total_tax || 0)
  );

  return {
    items: receiptData.items.map((item: any) => ({
      name: item.name,
      price: String(item.price),
      quantity: String(item.quantity),
      total: String(item.price * item.quantity),
      owners: updatedPeople
        .filter((p) => {
          const findItemPpl = p.items?.find(
            (itemPpl) => itemPpl?.id === item?.id
          );

          return Object.keys(findItemPpl || {})?.length > 0;
        })
        .map((p) => ({
          name: p.name,
          quantity: 1,
          tax: Math.round((item.price * 0.11) / item.quantity),
          total: String(item.price),
        })),
    })),

    store_information: {
      store_name: receiptData.storeName || "Unknown Store",
      email: receiptData.storeEmail || "-",
      phone_number: receiptData.storePhone || "-",
      npwp: receiptData.storeNpwp || "-",
      address: receiptData.storeAddress || "-",
    },

    totals: {
      change: receiptData.change || 0,
      discount: receiptData.discount || 0,
      payment: totalValue,
      subtotal: Number(getItemsSubtotal(receiptData.items)),
      additional_components: {
        service_charge: receiptData.serviceCharge || 0,
        parking_fee: receiptData.parkingFee || 0,
        dpp: getItemsSubtotal(receiptData.items),
        tax_amount: receiptData.tax?.total_tax || 0,
        total_additional:
          (receiptData.serviceCharge || 0) +
          (receiptData.parkingFee || 0) +
          (receiptData.tax?.total_tax || 0),
      },
      total: totalValue,
    },

    transaction_information: {
      date: new Date().toISOString().split("T")[0],
      time: new Date().toISOString().split("T")[1].split(".")[0],
      email: receiptData.email || "user@example.com",
      ocr_id: receiptData.ocr_id || `AUTO-${Date.now()}`,
    },
  };
}

// helper subtotal
function getItemsSubtotal(items: any[]) {
  return items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
}
