"use client";

import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeedbackPrompt() {
  const t = useTranslations("reviews");

  // Mobile version
  const mobilePrompt = (
    <div className="bg-gray-50 p-[24px] rounded-md my-4 md:hidden">
      <p className="text-dark text-[11px] font-roboto">
        {t("prompt.description")}
      </p>
    </div>
  );

  // Desktop/Tablet version
  const desktopPrompt = (
    <div className="hidden md:block bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 lg:p-8">
      <div className="flex items-start lg:items-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 shadow-sm">
          <MessageSquare className="text-blue" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg lg:text-xl font-medium text-gray-800 mb-2">
            {t("prompt.title")}
          </h3>
          <p className="text-gray-700 lg:text-base">
            {t("prompt.description")}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobilePrompt}
      {desktopPrompt}
    </>
  );
}
