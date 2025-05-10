"use client";
import Script from "next/script";

export default function JivoWidget() {
  return (
    <Script
      src="//code.jivo.ru/widget/YOUR_WIDGET_ID"
      strategy="afterInteractive"
    />
  );
}
