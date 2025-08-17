"use client";

import React from "react";

const LayoutContext = React.createContext<{
  showPremiumModal: boolean;
  setShowPremiumModal: (showPremiumModal: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isSidebarCollapsed: boolean) => void;
} | null>(null);

export default LayoutContext;
