"use client";

import logo from "@/assets/Logo.webp";
import tbank from "@/assets/T-Bank.webp";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const i18n = useTranslations("Footer");

  const footerLinks = [
    { id: "terms", href: "/user-agreement" },
    { id: "privacy", href: "/privacy-policy" },
    { id: "offer", href: "/public-offer" },
    { id: "contact", href: "/contact" },
    { id: "reviews", href: "/reviews" },
    { id: "faq", href: "/faq" },
  ];

  return (
    <footer className="bg-white px-4 sm:px-6 md:px-8 lg:px-10 mt-6 py-6 xxs:pb-20 md:pb-10 xl:pb-8 sm:pb-[75px] border-t border-gray-200">
      <div className="max-w-[1680px]   mx-auto">
        {/* Logo and T-bank section - mobile first */}
        <div className="flex items-center justify-between mb-6 sm:mb-0">
          <Image
            src={logo.src || "/placeholder.svg"}
            width={161}
            height={31}
            alt={i18n("altText.logo")}
            className="w-[140px] h-auto sm:w-[161px] md:w-[180px]"
          />
          <div className="sm:hidden">
            <Image
              src={tbank.src || "/placeholder.svg"}
              width={32}
              height={32}
              className="w-[32px] h-[32px] object-contain"
              alt={i18n("altText.tbank")}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
          <nav className="flex flex-col gap-y-3 mt-4 sm:flex-row sm:flex-wrap sm:gap-x-6 md:gap-x-8">
            {footerLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href as any}
                className="text-[12px] font-medium md:text-sm text-dark uppercase hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {i18n(`links.${link.id}`)}
              </Link>
            ))}
          </nav>
          <div className="hidden sm:block">
            <Image
              src={tbank.src || "/placeholder.svg"}
              width={40}
              height={40}
              className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] object-contain"
              alt={i18n("altText.tbank")}
            />
          </div>
        </div>
        <div className="mt-6  md:mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="text-sm text-gray-400">{i18n("copyright")}</div>
        </div>
      </div>
    </footer>
  );
}
