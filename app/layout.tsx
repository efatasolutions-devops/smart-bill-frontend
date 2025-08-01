import type React from "react"
import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans, Poppins } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "LihatBill - Kelola dan Bagi Tagihan",
  description: "Aplikasi untuk mengelola dan membagi tagihan dengan mudah",
    generator: 'efata.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable} ${poppins.variable}`}>
      <body className={`${plusJakarta.className} antialiased`}>{children}</body>
    </html>
  )
}
