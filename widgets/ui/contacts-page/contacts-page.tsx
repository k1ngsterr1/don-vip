import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl"; // Example with next-intl

export const ContactsPageBlock = () => {
  const t = useTranslations("Contacts.contacts");

  return (
    <main className="min-h-[60vh]">
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
      </div>
    </main>
  );
};
