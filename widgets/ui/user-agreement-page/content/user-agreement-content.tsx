"use client";

import { FileText, Info, Shield, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

export function UserAgreementContent() {
  const t = useTranslations("userAgreement");

  return (
    <div className="prose prose-blue max-w-none">
      {/* Document Header */}
      <div className="mb-10 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-2xl font-medium text-gray-900 m-0">
            {t("title")}
          </h1>
        </div>
        <p className="text-gray-500 italic">{t("introduction")}</p>
      </div>

      {/* Section 1: General Provisions */}
      <div className="mb-10">
        <h2
          id="general-provisions"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            1
          </span>
          {t("sections.1.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <p className="text-gray-700">
            {t.rich("sections.1.content.p1_1", {
              agreement: (chunks) => (
                <span className="font-medium text-blue-700">{chunks}</span>
              ),
              administration: (chunks) => (
                <span className="font-medium text-blue-700">{chunks}</span>
              ),
              user: (chunks) => (
                <span className="font-medium text-blue-700">{chunks}</span>
              ),
            })}
          </p>
          <p className="text-gray-700">{t("sections.1.content.p1_2")}</p>
        </div>
      </div>

      {/* Section 2: Terms and Definitions */}
      <div className="mb-10">
        <h2
          id="terms-definitions"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            2
          </span>
          {t("sections.2.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-2">
                {t("sections.2.content.terms.site.title")}
              </p>
              <p className="text-gray-600 text-sm">
                {t("sections.2.content.terms.site.description")}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-2">
                {t("sections.2.content.terms.user.title")}
              </p>
              <p className="text-gray-600 text-sm">
                {t("sections.2.content.terms.user.description")}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-2">
                {t("sections.2.content.terms.account.title")}
              </p>
              <p className="text-gray-600 text-sm">
                {t("sections.2.content.terms.account.description")}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-2">
                {t("sections.2.content.terms.digitalGoods.title")}
              </p>
              <p className="text-gray-600 text-sm">
                {t("sections.2.content.terms.digitalGoods.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Registration and Account */}
      <div className="mb-10">
        <h2
          id="registration-account"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            3
          </span>
          {t("sections.3.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  {t("sections.3.content.info")}
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-700">{t("sections.3.content.p3_1")}</p>
          <p className="text-gray-700">{t("sections.3.content.p3_2")}</p>
        </div>
      </div>

      {/* Section 4: Terms of Use */}
      <div className="mb-10">
        <h2
          id="terms-of-use"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            4
          </span>
          {t("sections.4.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <p className="text-gray-700">{t("sections.4.content.p4_1")}</p>
          <p className="text-gray-700 font-medium mt-4">
            {t("sections.4.content.p4_2.title")}
          </p>
          <ul className="space-y-2 mt-2">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                <span className="h-2 w-2 bg-red-500 rounded-full"></span>
              </span>
              <span className="text-gray-700">
                {t("sections.4.content.p4_2.itemsList.0")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                <span className="h-2 w-2 bg-red-500 rounded-full"></span>
              </span>
              <span className="text-gray-700">
                {t("sections.4.content.p4_2.itemsList.1")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                <span className="h-2 w-2 bg-red-500 rounded-full"></span>
              </span>
              <span className="text-gray-700">
                {t("sections.4.content.p4_2.itemsList.2")}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Section 5: Purchase of Digital Goods and Services */}
      <div className="mb-10">
        <h2
          id="digital-goods-purchase"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            5
          </span>
          {t("sections.5.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  {t("sections.5.content.warning")}
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-700">{t("sections.5.content.p5_1")}</p>
          <p className="text-gray-700">{t("sections.5.content.p5_2")}</p>
        </div>
      </div>

      {/* Section 6: Intellectual Property */}
      <div className="mb-10">
        <h2
          id="intellectual-property"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            6
          </span>
          {t("sections.6.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <p className="text-gray-700">{t("sections.6.content.p6_1")}</p>
          <p className="text-gray-700">{t("sections.6.content.p6_2")}</p>
        </div>
      </div>

      {/* Section 7: Confidentiality and Personal Data */}
      <div className="mb-10">
        <h2
          id="confidentiality"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            7
          </span>
          {t("sections.7.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg my-4">
            <div className="mr-4">
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-700">
                {t.rich("sections.7.content.info", {
                  link: (chunks) => (
                    <a
                      href="/privacy-policy"
                      className="text-blue-600 hover:underline"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            </div>
          </div>
          <p className="text-gray-700">{t("sections.7.content.p7_1")}</p>
          <p className="text-gray-700">{t("sections.7.content.p7_2")}</p>
        </div>
      </div>

      {/* Section 8: Limitation of Liability */}
      <div className="mb-10">
        <h2
          id="liability-limitation"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            8
          </span>
          {t("sections.8.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <p className="text-gray-700">{t("sections.8.content.p8_1")}</p>
          <p className="text-gray-700">{t("sections.8.content.p8_2")}</p>
        </div>
      </div>

      {/* Section 9: Account Termination */}
      <div className="mb-10">
        <h2
          id="account-termination"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            9
          </span>
          {t("sections.9.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <p className="text-gray-700">{t("sections.9.content.p9_1")}</p>
        </div>
      </div>

      {/* Section 10: Force Majeure */}
      <div className="mb-10">
        <h2
          id="force-majeure"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            10
          </span>
          {t("sections.10.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <p className="text-gray-700">{t("sections.10.content.p10_1")}</p>
        </div>
      </div>

      {/* Section 11: Payment Terms and Currencies */}
      <div className="mb-10">
        <h2
          id="payment-conditions"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            11
          </span>
          {t("sections.11.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <p className="text-gray-700">{t("sections.11.content.p11_1")}</p>
          <p className="text-gray-700">{t("sections.11.content.p11_2")}</p>
        </div>
      </div>

      {/* Section 12: Refunds and Order Cancellation */}
      <div className="mb-10">
        <h2
          id="refunds"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            12
          </span>
          {t("sections.12.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <p className="text-gray-700">{t("sections.12.content.p12_1")}</p>
          <p className="text-gray-700">{t("sections.12.content.p12_2")}</p>
        </div>
      </div>

      {/* Section 13: Liability for Actions of Third Parties */}
      <div className="mb-10">
        <h2
          id="third-party-liability"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            13
          </span>
          {t("sections.13.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <p className="text-gray-700">{t("sections.13.content.p13_1")}</p>
        </div>
      </div>

      {/* Section 14: Applicable Law and Dispute Resolution */}
      <div className="mb-10">
        <h2
          id="applicable-law"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            14
          </span>
          {t("sections.14.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <p className="text-gray-700">{t("sections.14.content.p14_1")}</p>
          <p className="text-gray-700">{t("sections.14.content.p14_2")}</p>
          <p className="text-gray-700">{t("sections.14.content.p14_3")}</p>
        </div>
      </div>

      {/* Section 15: Changes to the Agreement */}
      <div className="mb-10">
        <h2
          id="agreement-changes"
          className="scroll-mt-24 text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            15
          </span>
          {t("sections.15.title")}
        </h2>
        <div className="pl-4 border-l-2 border-blue-100 ml-3">
          <p className="text-gray-700">{t("sections.15.content.p15_1")}</p>
          <p className="text-gray-700">{t("sections.15.content.p15_2")}</p>
        </div>
      </div>
    </div>
  );
}
