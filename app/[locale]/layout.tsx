// app/[locale]/layout.tsx
import type React from "react";
import QuestionChatWrapper from "@/entities/question-chat/question-chat-wrapper";
import BottomTab from "@/features/bottom-tab/bottom-tab";
import Footer from "@/features/footer/footer";
import HeaderWrapper from "@/features/header/header-wrapper";
import { routing } from "@/i18n/routing";
import ClientLayout from "@/shared/ui/client-layout/client-layout";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Roboto, Roboto_Condensed, Unbounded } from "next/font/google";
import { notFound } from "next/navigation";
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
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
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
  params: { locale: string };
}) {
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <Script
          src="//code.jivo.ru/widget/LzgQISOnC6"
          strategy="afterInteractive"
          async
        />
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
        <NextIntlClientProvider locale={locale}>
          <ClientLayout>
            <HeaderWrapper />
            <main>{children}</main>
            <BottomTab />
            <Footer />
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
