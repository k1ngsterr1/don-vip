"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  const hideSearchBarPaths = [
    "/faq",
    "/privacy-policy",
    "/terms",
    "/offer",
    "/reviews",
    "/send-review",
    "/auth/register",
    "/auth/login",
    "/auth/forgot-password",
    "/contact",
    "/coupons+",
  ];

  const isProfilePath = pathname.startsWith("/profile");

  const isSearchBar = !(hideSearchBarPaths.includes(pathname) || isProfilePath);

  return <Header isSearchBar={isSearchBar} />;
}
