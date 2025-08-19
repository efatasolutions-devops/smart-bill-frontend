import type React from "react";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lihat Bill - Beta",
  description: "Aplikasi untuk mengelola dan membagi tagihan dengan mudah",
  generator: "efata.dev",
  // Open Graph / Social metadata (opsional)
  openGraph: {
    title: "Lihat Bill - Beta",
    description: "Aplikasi untuk mengelola dan membagi tagihan dengan mudah",
    url: "https://lihatbill.com",
    siteName: "Lihat Bill",
    locale: "id_ID",
    type: "website",
  },
  // Twitter metadata (opsional)
  twitter: {
    card: "summary_large_image",
    title: "Lihat Bill - Beta",
    description: "Aplikasi untuk mengelola dan membagi tagihan dengan mudah",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakarta.variable} ${poppins.variable}`}
    >
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* 
          Optional: Jika kamu punya manifest.json
          <link rel="manifest" href="/site.webmanifest" />
        */}
      </head>
      <body className={`${plusJakarta.className} antialiased`}>{children}</body>
    </html>
  );
}