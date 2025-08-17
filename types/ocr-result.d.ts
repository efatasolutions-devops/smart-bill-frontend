export type OcrResult = {
  items: Partial<{
    name: string;
    price: string;
    quantity: string;
    total: string;
  }>[];
  store_information: Partial<{
    address: string;
    email: string;
    npwp: string;
    phone_number: string;
    store_name: string;
  }>;
  totals: Partial<{
    change: string;
    discount: string;
    payment: string;
    subtotal: string;
    tax: Partial<{
      amount: string;
      service_charge: string;
      dpp: string;
      name: string;
      total_tax: string;
    }>;
    total: string;
  }>;
  transaction_information: Partial<{
    date: string;
    time: string;
    transaction_id: string;
  }>;
};
