"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Crown, Check, Sparkles, Star } from "lucide-react"

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
}

export function PremiumModal({ isOpen, onClose, feature }: PremiumModalProps) {
  const features = [
    "Unlimited split bill history",
    "Advanced financial analytics",
    "Calendar expense tracking",
    "Export to PDF & Excel",
    "Priority customer support",
    "Custom categories & tags",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md card-modern border-0">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mb-4 shadow-xl">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold font-display gradient-text">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-slate-600 font-body">
            Unlock <span className="font-semibold text-amber-600">{feature}</span> and all premium features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-amber-800 font-display">Rp 49,000</div>
              <div className="text-sm text-amber-600 font-body">per bulan</div>
            </div>
          </div>

          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm text-slate-700 font-body">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <Button className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-display font-semibold py-3 rounded-xl btn-modern shadow-xl">
            <Sparkles className="w-4 h-4 mr-2" />
            Start 7-Day Free Trial
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full glass-effect border-slate-200/50 hover:bg-white/80 font-body bg-transparent"
          >
            Maybe Later
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 font-body">
            <Star className="w-3 h-3 inline mr-1 text-amber-500" />
            Cancel anytime • No commitment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
