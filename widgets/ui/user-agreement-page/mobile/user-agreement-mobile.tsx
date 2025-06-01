"use client";

import { ArrowLeft, FileText } from "lucide-react";
import { UserAgreementContactFooter } from "../footer/user-agreement-footer";
import { UserAgreementContent } from "../content/user-agreement-content";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function UserAgreementMobile() {
  const t = useTranslations("userAgreement.page");
  const sidebarT = useTranslations("userAgreement.sidebar");
  const [activeSection, setActiveSection] = useState("general-provisions");

  const sections = [
    { id: "general-provisions", key: "section1" },
    { id: "terms-definitions", key: "section2" },
    { id: "registration-account", key: "section3" },
    { id: "terms-of-use", key: "section4" },
    { id: "digital-goods-purchase", key: "section5" },
    { id: "intellectual-property", key: "section6" },
    { id: "confidentiality", key: "section7" },
    { id: "liability-limitation", key: "section8" },
    { id: "account-termination", key: "section9" },
    { id: "force-majeure", key: "section10" },
    { id: "payment-conditions", key: "section11" },
    { id: "refunds", key: "section12" },
    { id: "third-party-liability", key: "section13" },
    { id: "applicable-law", key: "section14" },
    { id: "agreement-changes", key: "section15" },
  ];

  const scrollToSection = (sectionId: string) => {
    // Use a more aggressive approach to find and scroll to the element
    const element = document.querySelector(`#${sectionId}`);

    if (element) {
      // Calculate the position manually
      const rect = element.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = rect.top + scrollTop - 80;

      // Force scroll immediately
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
    } else {
      window.location.hash = sectionId;

      setTimeout(() => {
        const retryElement = document.querySelector(`#${sectionId}`);
        if (retryElement) {
          retryElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          setActiveSection(sectionId);
        }
      }, 100);
    }
  };

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
        <UserAgreementContent />
        <UserAgreementContactFooter />
      </div>
    </div>
  );
}
