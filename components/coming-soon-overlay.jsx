import React from "react";
import { Button } from "@/components/ui/button";
import LayoutContext from "@/context/layout-context";

export default function ProFeatureOverlay() {
  const ctx = React.useContext(LayoutContext);

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-200/50 backdrop-blur-sm z-10 flex items-center justify-center">
      <Button
        size="sm"
        // onClick={() => ctx?.setShowPremiumModal(true)}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-body btn-modern"
      >
        Coming Soon
      </Button>
    </div>
  );
}
