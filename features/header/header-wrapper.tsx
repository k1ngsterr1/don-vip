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
  ];

  const isSearchBar = !hideSearchBarPaths.includes(pathname);

  return <Header isSearchBar={isSearchBar} />;
}
