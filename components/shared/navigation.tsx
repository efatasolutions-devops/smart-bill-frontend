"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationProps {
  username: string
  onLogout: () => void
}

export function Navigation({ username, onLogout }: NavigationProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/splitbill", label: "SplitBill" },
    { href: "/finance", label: "Finance" },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LB</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800">LihatBill</h1>
            </div>
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "text-primary-600 font-medium bg-primary-50"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-slate-600">
              Hi, <span className="font-medium text-slate-800">{username}</span>!
            </div>
            <Button variant="outline" onClick={onLogout} className="border-slate-300 hover:bg-slate-50 bg-transparent">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
