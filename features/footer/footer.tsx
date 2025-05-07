"use client";

import logo from "@/assets/Logo.webp";
import tbank from "@/assets/T-Bank.webp";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const i18n = useTranslations("Footer");

  const footerLinks = [
    { id: "terms", href: "/terms" },
    { id: "privacy", href: "/privacy-policy" },
    { id: "offer", href: "/public-offer" },
    { id: "contact", href: "/contact" },
    { id: "reviews", href: "/reviews" },
    { id: "faq", href: "/faq" },
  ];

  return (
    <footer className="bg-white px-4 sm:px-6 md:px-8 lg:px-12 mt-6 py-6 pb-16 sm:pb-12 border-t border-gray-100">
      <div className="max-w-[1680px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
          {/* Logo section */}
          <div className="flex items-center justify-between sm:justify-start sm:w-auto">
            <Image
              src={logo.src || "/placeholder.svg"}
              width={161}
              height={31}
              alt={i18n("altText.logo")}
              className="w-[140px] h-auto sm:w-[161px] md:w-[180px]"
            />
            <div className="sm:hidden ml-4">
              <Image
                src={tbank.src || "/placeholder.svg"}
                width={32}
                height={32}
                className="w-[32px] h-[32px] object-contain"
                alt={i18n("altText.tbank")}
              />
            </div>
          </div>

          {/* Links and T-bank section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 md:gap-8">
            <nav className="grid grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-6 md:gap-x-8 sm:flex sm:flex-wrap">
              {footerLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-[13px] md:text-sm text-dark uppercase hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  {i18n(`links.${link.id}`)}
                </Link>
              ))}
            </nav>
            <div className="hidden sm:block sm:ml-2 md:ml-4">
              <Image
                src={tbank.src || "/placeholder.svg"}
                width={40}
                height={40}
                className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] object-contain"
                alt={i18n("altText.tbank")}
              />
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="text-sm text-gray-400">{i18n("copyright")}</div>
          <div className="text-xs sm:text-sm text-gray-400">
            <Link href="/terms" className="hover:text-gray-600 mr-4">
              {i18n("copyrightLinks.terms")}
            </Link>
            <Link href="/privacy-policy" className="hover:text-gray-600">
              {i18n("copyrightLinks.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
