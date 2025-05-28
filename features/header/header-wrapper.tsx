"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Removed hideSearchBarBasePaths and related logic
  const isProfilePath = pathname.startsWith("/profile");

  // Always show search bar except on profile paths
  const isSearchBar = !isProfilePath;

  return <Header isSearchBar={isSearchBar} />;
}
