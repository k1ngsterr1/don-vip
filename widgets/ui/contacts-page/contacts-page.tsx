import React from "react";
import { useTranslations, useLocale } from "next-intl"; // Added useLocale
import { Link } from "@/i18n/navigation";

export const ContactsPageBlock = () => {
  const t = useTranslations("Contacts.contacts");
  const locale = useLocale();

  // Legal information translations
  const legalTranslations = {
    ru: {
      legalInfo: "Юридическая информация",
      organization: "Организация",
      address: "Адрес",
      officialContacts: "Официальные контакты",
      director: "Директор:",
      company: "Компания: ",
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
      company: "Company: ",
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

  return (
    <div className="min-h-[60vh]">
      <Link href="/" className="text-blue text-[15px] mt-[28px] py-2 block">
        {t("back")}
      </Link>
      <div className="py-4">
        <h1 className="text-[18px] font-unbounded font-bold mb-4">
          {t("title")}
        </h1>
        <div className="space-y-1">
          <p>
            <span className="font-bold">{t("email")}</span> hoyakap@gmail.com
          </p>
          <p>
            <span className="font-bold">{t("cooperationEmail")}</span>{" "}
            support@don-vip.com
          </p>
          <p>
            <span className="font-bold">{t("address")}</span>{" "}
            {t("addressValue")}
          </p>
        </div>
        <div className="space-y-1 mt-6">
          <p>
            <span className="font-bold">{t("companyName")}</span>{" "}
            {t("companyNameValue")}
          </p>
          <p>
            <span className="font-bold">{t("partnerCompany")}</span>{" "}
            {t("partnerCompanyValue")}
          </p>
          <p>
            <span className="font-bold">{t("inn")}</span> 250822605454
          </p>
          <p>
            <span className="font-bold">{t("ogrnip")}</span> 324253600050587
          </p>
        </div>
        <div className="mt-6">
          <p>
            <span className="font-bold">{t("phone")}</span> +7 (924) 004 00 70
          </p>
        </div>

        {/* Legal Information Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-[16px] font-bold mb-4">{legal.legalInfo}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Information */}
            <div className="space-y-3">
              <h3 className="text-[14px] font-semibold text-gray-800">
                {legal.organization}
              </h3>
              <div className="space-y-1">
                <p>
                  <span className="font-bold">{legal.director}:</span> Davit
                  Aslanyan
                </p>
                <p>
                  <span className="font-bold">{legal.company}:</span> DMME HK
                  LIMITED
                </p>
                <p>
                  <span className="font-bold">{legal.country}:</span> HK
                </p>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-3">
              <h3 className="text-[14px] font-semibold text-gray-800">
                {legal.address}
              </h3>
              <div className="space-y-1">
                <p>
                  <span className="font-bold">{legal.street}:</span> 000000,
                  Hong Kong, 8/F., China Hong Kong Tower, 8-12 Hennessy Road,
                  Wan Chai, Hong Kong
                </p>
                <p>
                  <span className="font-bold">{legal.city}:</span> Hong Kong
                </p>
                <p>
                  <span className="font-bold">{legal.postalCode}:</span> 000000
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 space-y-3">
            <h3 className="text-[14px] font-semibold text-gray-800">
              {legal.officialContacts}
            </h3>
            <div className="space-y-1">
              <p>
                <span className="font-bold">{legal.phone}:</span>{" "}
                <a
                  href="tel:+37443090070"
                  className="text-blue-600 hover:underline"
                >
                  +374.43090070
                </a>
              </p>
              <p>
                <span className="font-bold">{legal.email}:</span>{" "}
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
  );
};
