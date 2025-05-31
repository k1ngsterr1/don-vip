"use client";

import { ArrowLeft, FileText } from "lucide-react";
import { UserAgreementContent } from "../content/user-agreement-content";
import { UserAgreementSidebar } from "../sidebar/user-agreement-sidebar";
import { UserAgreementContactFooter } from "../footer/user-agreement-footer";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function UserAgreementDesktop() {
  const t = useTranslations("userAgreement.page");

  return (
    <div className="hidden md:block  mx-auto px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8 lg:mb-12">
        <div className="flex items-center mb-4">
          <Link
            href={"/"}
            className="text-blue-600 hover:text-blue-700 transition-colors flex items-center group"
          >
            <ArrowLeft
              size={16}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-base">{t("backLink")}</span>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-medium text-gray-800">
              {t("title")}
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl">{t("lastUpdated")}</p>
          </div>
          <div className="hidden lg:flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full">
            <FileText className="text-blue-600 w-8 h-8" />
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <UserAgreementSidebar />
        </div>
        <div className="lg:w-3/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <UserAgreementContent />
            <UserAgreementContactFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
