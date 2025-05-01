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
    <footer className="bg-white px-4 md:px-8 lg:px-12 mt-[24px] py-6 pb-32 md:pb-12 border-t border-gray-100">
      <div className="max-w-[1680px] mx-auto">
        <div className="md:flex md:justify-between">
          {/* Logo and T-Bank section */}
          <div className="flex items-center justify-between mb-6 md:mb-0 md:w-1/3">
            <Image
              src={logo.src || "/placeholder.svg"}
              width={161}
              height={31}
              alt={i18n("altText.logo")}
              className="w-[161px] h-[31px] md:w-[180px] md:h-[35px]"
            />
            <div className="md:hidden">
              <Image
                src={tbank.src || "/placeholder.svg"}
                width={32}
                height={32}
                className="w-[32px] h-[32px]"
                alt={i18n("altText.tbank")}
              />
            </div>
          </div>

          {/* Links section */}
          <div className="md:w-2/3 md:flex md:justify-end">
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:flex lg:space-x-8">
              {footerLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="block md:inline-block text-[13px] md:text-sm text-dark uppercase hover:text-blue-600 transition-colors md:mb-3"
                >
                  {i18n(`links.${link.id}`)}
                </Link>
              ))}
            </div>
            <div className="hidden md:block md:ml-6">
              <Image
                src={tbank.src || "/placeholder.svg"}
                width={40}
                height={40}
                className="w-[40px] h-[40px]"
                alt={i18n("altText.tbank")}
              />
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-6 md:mt-8 text-left text-gray-400 md:flex md:justify-between md:items-center">
          <div>{i18n("copyright")}</div>
          <div className="hidden md:block text-sm">
            <Link
              href="/terms"
              className="text-gray-400 hover:text-gray-600 mr-4"
            >
              {i18n("copyrightLinks.terms")}
            </Link>
            <Link
              href="/privacy-policy"
              className="text-gray-400 hover:text-gray-600"
            >
              {i18n("copyrightLinks.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
