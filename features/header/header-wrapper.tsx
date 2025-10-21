"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function HeaderWrapper() {
  const pathname = usePathname() || "";

  const segments = pathname.split("/").filter(Boolean); // Removes leading and trailing slashes

  // Match "/{locale}/techworks"
  const isTechworksPath = segments.length === 2 && segments[1] === "techworks";

  // Match "/{locale}/search"
  const isSearchPath = segments.length === 2 && segments[1] === "search";

  // Match "/{locale}/product/{id}" - hide search on product pages
  const isProductPath = segments.length === 3 && segments[1] === "product";

  // Don't render Header on "/{locale}/techworks"
  if (isTechworksPath) {
    return null;
  }

  if (isSearchPath || isProductPath) {
    return <Header isSearchBar={false} />;
  }

  // Default case – render Header without props (or with default props)
  return <Header />;
}
