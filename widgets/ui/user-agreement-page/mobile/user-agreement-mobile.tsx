"use client";

import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { UserAgreementContent } from "../content/user-agreement-content";
import { UserAgreementContactFooter } from "../footer/user-agreement-footer";
export function UserAgreementMobile() {
  const t = useTranslations("userAgreement.page");
  // Removed sidebarT and activeSection logic as there's no mobile sidebar in this component.
  // The UserAgreementContent itself has IDs for sections.

  return (
    <div className="md:hidden px-4 py-6">
      <div className="mb-6">
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
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full flex-shrink-0">
                <FileText className="text-blue-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-500 text-sm">{t("lastUpdated")}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        {/* 
          If a mobile-specific table of contents / scroll navigation is needed, 
          it would be added here or UserAgreementContent could be adapted.
          For now, UserAgreementContent provides the sections with IDs.
        */}
        <UserAgreementContent />
        <UserAgreementContactFooter />
      </div>
    </div>
  );
}
