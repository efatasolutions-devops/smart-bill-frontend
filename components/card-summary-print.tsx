"use client"; // ✅ WAJIB ADA karena pakai custom hook

import { forwardRef, memo } from "react";
import { SplitUtils } from "@/lib/split-calculator";
import { useSplitCalculator } from "@/hooks/use-split-calculator"; // ✅ Sudah benar

const CardSummaryPrint_ = ({ receiptData, people }, ref) => {
  // ✅ Sekarang aman dipanggil karena ada "use client"
  const { calculation, stats } = useSplitCalculator(receiptData, people);

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        padding: "20px",
        margin: "0 auto",
        maxWidth: "800px",
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <p
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#0365d0",
          marginBottom: "20px",
        }}
      >
        Lihat<span style={{ color: "#019bfd" }}>Bill</span>
      </p>

      {/* Success Message */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-19.32-7.68"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#22c55e" }}>
            Split Complete!
          </h2>
        </div>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          Here's how much everyone needs to pay
        </p>
      </div>

      {/* Restaurant Card */}
      <div
        style={{
          background: "linear-gradient(90deg, #f0f9ff, #e0e7ff)",
          border: "1px solid #93c5fd",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16h2"></path>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
            <path d="M10 14h4"></path>
            <path d="M10 18h4"></path>
            <path d="M10 10h4"></path>
          </svg>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1d4ed8",
            }}
          >
            {receiptData?.restaurant?.store_name || "Unknown Restaurant"}
          </h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
            marginTop: "12px",
          }}
        >
          {/* People */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "4px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5.86A1 1 0 0 1 5 18.86V5.14A1 1 0 0 1 5.86 4H9"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                <line x1="8" y1="22.08" x2="8" y2="12"></line>
                <line x1="16" y1="22.08" x2="16" y2="12"></line>
              </svg>
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "#1d4ed8" }}>
                {stats?.totalPeople ?? 0}
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#1d4ed8" }}>People</span>
          </div>

          {/* Items */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "4px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16h2"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M10 14h4"></path>
                <path d="M10 18h4"></path>
                <path d="M10 10h4"></path>
              </svg>
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "#1d4ed8" }}>
                {stats?.totalItems ?? 0}
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#1d4ed8" }}>Items</span>
          </div>

          {/* Average */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "4px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span style={{ fontSize: "18px", fontWeight: "bold", color: "#1d4ed8" }}>
                {SplitUtils.formatCurrency(stats?.averagePerPerson)}
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#1d4ed8" }}>Average</span>
          </div>

          {/* Total Bill */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "#1d4ed8" }}>
                {SplitUtils.formatCurrency(calculation?.total)}
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#1d4ed8" }}>Total Bill</span>
          </div>
        </div>
      </div>

      {/* Individual Breakdown */}
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "16px",
        }}
      >
        Individual Breakdown
      </h3>

      {calculation?.perPersonBreakdown?.length > 0 ? (
        calculation.perPersonBreakdown.map((breakdown) => (
          <div
            key={breakdown.person.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              marginBottom: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {breakdown.person.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600" }}>
                    {breakdown.person.name || "Unknown"}
                  </h4>
                  <p style={{ fontSize: "12px", color: "#6b7280" }}>
                    {breakdown.items?.length || 0} items
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
                  {SplitUtils.formatCurrency(breakdown.total)}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    backgroundColor: "#f3f4f6",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  {SplitUtils.calculatePercentage(breakdown.total, calculation.total).toFixed(1)}% of total
                </div>
              </div>
            </div>

            <div style={{ padding: "16px", backgroundColor: "#f9fafb" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
                Ordered Items
              </h4>
              <div style={{ marginBottom: "16px", fontSize: "14px" }}>
                {breakdown.items?.length > 0 ? (
                  breakdown.items.map((item) => (
                    <div
                      key={`${item.id}-${breakdown.person.id}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ color: "#6b7280" }}>
                        {item.name} × {item.quantity || 1}
                      </span>
                      <span>{SplitUtils.formatCurrency(item.price)}</span>
                    </div>
                  ))
                ) : (
                  <span style={{ color: "#9ca3af", fontStyle: "italic" }}>No items</span>
                )}
              </div>

              <hr style={{ borderTop: "1px solid #e5e7eb", margin: "12px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "6px" }}>
                <span style={{ color: "#6b7280" }}>Subtotal</span>
                <span>{SplitUtils.formatCurrency(breakdown.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "6px" }}>
                <span style={{ color: "#6b7280" }}>Tax (proportional)</span>
                <span>{SplitUtils.formatCurrency(breakdown.taxAmount)}</span>
              </div>
              <hr style={{ borderTop: "1px solid #e5e7eb", margin: "6px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "600" }}>
                <span>Total to Pay</span>
                <span>{SplitUtils.formatCurrency(breakdown.total)}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: "#6b7280", fontStyle: "italic", textAlign: "center" }}>
          No breakdown available.
        </p>
      )}

      {/* Receipt Summary */}
      <div
        style={{
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#f3f4f6",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>Receipt Summary</h3>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "6px" }}>
          <span style={{ color: "#6b7280" }}>Subtotal</span>
          <span>{SplitUtils.formatCurrency(calculation?.subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "6px" }}>
          <span style={{ color: "#6b7280" }}>Tax</span>
          <span>{SplitUtils.formatCurrency(calculation?.tax)}</span>
        </div>
        <hr style={{ borderTop: "1px solid #d1d5db", margin: "6px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "600" }}>
          <span>Total</span>
          <span>{SplitUtils.formatCurrency(calculation?.total)}</span>
        </div>
      </div>

      {/* Footer */}
      <p
        style={{
          fontSize: "12px",
          color: "#6b7280",
          textAlign: "center",
          marginTop: "16px",
        }}
      >
        Generated in app.lihatbill.com
      </p>
    </div>
  );
};

// Gunakan memo dan forwardRef
const CardSummaryPrint = memo(forwardRef(CardSummaryPrint_));
export default CardSummaryPrint;