"use client";

import { PremiumModal } from "@/components/premium-modal";
import { Sidebar } from "@/components/sidebar";
import LayoutContext from "@/context/layout-context";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile: drawer, Desktop: collapse
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Tentukan apakah halaman saat ini adalah splitbill
  const isSplitBillPage = pathname.startsWith("/splitbill");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/10 to-secondary-200/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-200/10 to-primary-200/10 rounded-full blur-3xl"></div>
      </div>

      <LayoutContext.Provider
        value={{
          showPremiumModal,
          setShowPremiumModal,
          isSidebarCollapsed,
          setIsSidebarCollapsed,
          isSidebarOpen,
          setIsSidebarOpen,
        }}
      >
        {/* Hamburger Button (Mobile Only) */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Sidebar (Off-canvas di mobile, normal di desktop) */}
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <div
          className={cn(
            "relative z-10 transition-all duration-200 min-h-screen",
            isSplitBillPage
              ? "ml-0" // Split bill: no sidebar margin
              : "md:ml-20", // Desktop: sidebar width when collapsed
            !isSplitBillPage &&
              !isSidebarCollapsed &&
              "md:ml-72" // Desktop: full sidebar width
          )}
        >
          {/* Tambahkan padding untuk mobile jika perlu */}
          <div className="min-h-screen">{children}</div>
        </div>
      </LayoutContext.Provider>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        feature="Split Bill History & Analytics"
      />
    </div>
  );
}