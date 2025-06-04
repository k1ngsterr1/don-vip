"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function FooterWrapper() {
  const pathname = usePathname() || "";

  // Разбиваем путь на сегменты, убирая пустые строки
  const segments = pathname.split("/").filter(Boolean);
  // Проверяем, что путь выглядит как "/<locale>/techworks"
  const isTechworksPath = segments.length === 2 && segments[1] === "techworks";

  // Если находимся на /{locale}/techworks, не рендерим Footer
  if (isTechworksPath) {
    return null;
  }

  // Во всех остальных случаях – рендерим Footer
  return <Footer />;
}
