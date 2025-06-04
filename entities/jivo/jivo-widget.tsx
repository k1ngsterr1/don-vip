"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function JivoWidget() {
  const pathname = usePathname() || "";

  // Разбиваем путь на сегменты, чтобы проверить формат "/<locale>/techworks"
  const segments = pathname.split("/").filter(Boolean);
  const isTechworksPath = segments.length === 2 && segments[1] === "techworks";

  // Если мы на странице "/{locale}/techworks", не рендерим скрипт
  if (isTechworksPath) {
    return null;
  }

  // Во всех остальных случаях рендерим Script виджета
  return (
    <Script
      src="//code.jivo.ru/widget/YOUR_WIDGET_ID"
      strategy="afterInteractive"
    />
  );
}
