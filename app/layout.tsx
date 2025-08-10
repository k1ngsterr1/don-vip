import type React from "react";
import type { Metadata } from "next";
import { Roboto, Roboto_Condensed, Unbounded } from "next/font/google";

import Script from "next/script"; // <-- ✅ Import Script
import "./globals.css";
import { getTranslations } from "next-intl/server";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "/favicon.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZYRR1HX71W"
          strategy="afterInteractive"
        />
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(98661639, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true
              });
            `,
          }}
        />
        <Script
          id="jivo-widget"
          src="//code.jivo.ru/widget/LzgQISOnC6"
          strategy="afterInteractive"
        />
        <Script id="jivo-custom-style" strategy="afterInteractive">
          {`
    // Ждём загрузки API Jivo
    (function waitForJivo() {
      if (typeof window.jivo_api !== 'undefined') {
        // Пример: смещаем виджет вверх на 100px
        window.jivo_api.setWidgetPosition({ bottom: '300px', right: '30px' });
      } else {
        setTimeout(waitForJivo, 500);
      }
    })();
  `}
        </Script>
      </head>
      <body
        className={`
          ${roboto.variable}
          ${robotoCondensed.variable}
          ${unbounded.variable}
          antialiased
          w-full
        `}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
