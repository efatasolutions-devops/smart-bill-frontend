"use client";

import { PremiumModal } from "@/components/premium-modal";
import { Sidebar } from "@/components/sidebar";
import LayoutContext from "@/context/layout-context";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 relative overflow-hidden">
      <div
        className="absolute inset-0 overflow-hidden"
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
        }}
      >
        <Sidebar />

        <div
          className={cn(
            isSidebarCollapsed ? "ml-20" : "ml-72",
            "relative z-10 transition-all duration-200"
          )}
        >
          {children}
        </div>
      </LayoutContext.Provider>
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        feature="Split Bill History & Analytics"
      />
    </div>
  );
}
