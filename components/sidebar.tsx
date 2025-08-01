"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Receipt, LayoutDashboard, TrendingUp, Crown, Menu, X, Sparkles, Star } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    {
      href: "/beranda",
      label: "Beranda",
      icon: Home,
      isPremium: false,
    },
    {
      href: "/splitbill",
      label: "Split Bill",
      icon: Receipt,
      isPremium: false,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      isPremium: true,
    },
    {
      href: "/finance",
      label: "Finance",
      icon: TrendingUp,
      isPremium: true,
    },
  ]

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-full glass-effect border-r border-white/20 transition-all duration-300 z-50 ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm font-display">LB</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-800 font-display">LihatBill</h1>
                    <p className="text-xs text-slate-500 font-body">Free Version</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hover:bg-white/10"
              >
                {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? "bg-primary-100/80 text-primary-700 shadow-sm"
                        : "text-slate-600 hover:bg-white/50 hover:text-slate-800"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-primary-600" : ""}`} />
                    {!isCollapsed && (
                      <>
                        <span className="font-medium font-body flex-1">{item.label}</span>
                        {item.isPremium && (
                          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-1 border-0">
                            <Crown className="w-3 h-3 mr-1" />
                            PRO
                          </Badge>
                        )}
                      </>
                    )}
                    {isCollapsed && item.isPremium && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Premium CTA */}
          {!isCollapsed && (
            <div className="p-4 border-t border-white/10">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-amber-800 font-display text-sm">Upgrade to Pro</span>
                </div>
                <p className="text-xs text-amber-700 mb-3 font-body">Unlock all features and get unlimited access</p>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-body btn-modern">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Pro
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content spacer */}
      <div className={`${isCollapsed ? "ml-20" : "ml-72"} transition-all duration-300`}>
        {/* This div creates space for the sidebar */}
      </div>
    </>
  )
}
