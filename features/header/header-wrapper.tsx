"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  const hideSearchBarBasePaths = [
    "faq",
    "public-offer",
    "privacy-policy",
    "search",
    "terms",
    "offer",
    "reviews",
    "send-review",
    "auth/register",
    "auth/login",
    "auth/forgot-password",
    "contact",
    "coupons+",
    "order+",
  ];

  const locales = ["", "/en", "/ru"];

  const hideSearchBarPaths = locales.flatMap((locale) =>
    hideSearchBarBasePaths.map((path) => `${locale}/${path}`)
  );

  const isProfilePath = pathname.startsWith("/profile");

  const isSearchBar = !(hideSearchBarPaths.includes(pathname) || isProfilePath);

  return <Header isSearchBar={isSearchBar} />;
}
