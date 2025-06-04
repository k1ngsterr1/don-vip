"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function HeaderWrapper() {
  const pathname = usePathname() || "";

  // Проверим, что путь имеет формат "/<locale>/techworks" (без дополнительных сегментов)
  // Например: "/en/techworks" или "/ru/techworks"
  const segments = pathname.split("/").filter(Boolean); // ["en", "techworks"] или ["ru", "techworks"]
  const isTechworksPath = segments.length === 2 && segments[1] === "techworks";

  // Если мы на /{locale}/techworks, вообще не рендерим Header
  if (isTechworksPath) {
    return null;
  }

  // Остальные страницы – рендерим Header
  return <Header />;
}
