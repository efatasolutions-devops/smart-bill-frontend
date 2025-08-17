"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function LayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();

  // useEffect(() => {
  //   const isUserLogin = localStorage?.getItem("isLoggedIn");
  //   const hasUserName = localStorage?.getItem("username");
  //   // Redirect to Beranda instead of dashboard

  //   if (isUserLogin && hasUserName) {
  //     router.push("/beranda");
  //   } else {
  //     router.push("/login");
  //   }
  // }, [router]);
  return children;
}
