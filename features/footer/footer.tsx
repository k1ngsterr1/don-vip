"use client";

import logo from "@/assets/Logo.webp";
import tbank from "@/assets/T-Bank.webp";
import sbp from "@/assets/sbp.png";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const i18n = useTranslations("Footer");
  const locale = useLocale();

  // Legal information translations
  const legalTranslations = {
    ru: {
      legalInfo: "Юридическая информация",
      organization: "Организация",
      address: "Адрес",
      officialContacts: "Официальные контакты",
      director: "Директор:",
      company: "Компания:",
      country: "Страна:",
      street: "Улица:",
      city: "Город:",
      postalCode: "Почтовый индекс:",
      phone: "Телефон:",
      email: "Email:",
    },
    en: {
      legalInfo: "Legal Information",
      organization: "Organization",
      address: "Address",
      officialContacts: "Official Contacts",
      director: "Director:",
      company: "Company:",
      country: "Country:",
      street: "Street:",
      city: "City:",
      postalCode: "Postal Code:",
      phone: "Phone:",
      email: "Email:",
    },
  };

  const legal =
    legalTranslations[locale as keyof typeof legalTranslations] ||
    legalTranslations.ru;

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
        </div>
        <div className="mt-6  md:mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-400">{i18n("copyright")}</div>
            <div className="text-xs text-gray-500">
              000000, Hong Kong, 8/F., China Hong Kong Tower, 8-12 Hennessy
              Road, Wan Chai, Hong Kong
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Image
              src={require("@/assets/mir.webp")}
              width={40}
              height={24}
              alt="Mir"
              className="h-6 w-auto"
            />
            <Image
              src={require("@/assets/tbank.webp")}
              width={40}
              height={24}
              alt="Visa"
              className="h-6 w-auto"
            />
            <Image
              src={require("@/assets/visa.webp")}
              width={40}
              height={24}
              alt="Visa"
              className="h-6 w-auto"
            />
            <Image
              src={require("@/assets/mastercard.webp")}
              width={40}
              height={24}
              alt="Mastercard"
              className="h-6 w-auto"
            />
            <Image
              src={require("@/assets/payment.webp")}
              width={40}
              height={24}
              alt="Payment"
              className="h-6 w-auto"
            />
            <Image
              src={require("@/assets/sber.webp")}
              width={40}
              height={24}
              alt="Sber"
              className="h-6 w-auto"
            />
            <Image
              src={require("@/assets/paypal.webp")}
              width={40}
              height={24}
              alt="PayPal"
              className="h-6 w-auto"
            />
          </div>
        </div>

        {/* Legal Information Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-[14px] font-bold mb-4 text-gray-800">
            {legal.legalInfo}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs md:text-sm">
            {/* Company Information */}
            <div className="space-y-2">
              <h3 className="text-[12px] font-semibold text-gray-700">
                {legal.organization}
              </h3>
              <div className="space-y-1 text-gray-600">
                <p>
                  <span className="font-medium">{legal.director}</span> Davit
                  Aslanyan
                </p>
                <p>
                  <span className="font-medium">{legal.company}</span>
                  <span className="font-black text-gray-900 text-sm md:text-base">
                    DMME HK LIMITED
                  </span>
                </p>
                <p>
                  <span className="font-medium">{legal.country}</span> HK
                </p>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-2">
              <h3 className="text-[12px] font-semibold text-gray-700">
                {legal.address}
              </h3>
              <div className="space-y-1 text-gray-600">
                <p>
                  <span className="font-medium">{legal.street}</span> 000000,
                  Hong Kong, 8/F., China Hong Kong Tower, 8-12 Hennessy Road,
                  Wan Chai, Hong Kong
                </p>
                <p>
                  <span className="font-medium">{legal.city}</span> Hong Kong
                </p>
                <p>
                  <span className="font-medium">{legal.postalCode}</span> 000000
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <h3 className="text-[12px] font-semibold text-gray-700">
                {legal.officialContacts}
              </h3>
              <div className="space-y-1 text-gray-600">
                <p>
                  <span className="font-medium">{legal.phone}</span>{" "}
                  <a
                    href="tel:+37443090070"
                    className="text-blue-600 hover:underline"
                  >
                    +852 3008 0551
                  </a>
                </p>
                <p>
                  <span className="font-medium">{legal.email}</span>{" "}
                  <a
                    href="mailto:info@don-vip.com"
                    className="text-blue-600 hover:underline"
                  >
                    info@don-vip.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
