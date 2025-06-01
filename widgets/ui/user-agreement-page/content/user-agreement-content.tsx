"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function UserAgreementContent() {
  const t = useTranslations("userAgreement");

  return (
    <div className="prose prose-gray max-w-none">
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-sm mb-0">{t("introduction")}</p>
      </div>

      {/* Section 1: General Provisions */}
      <section id="general-provisions" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.1.title")}
        </h2>
        <p className="text-gray-600 mb-3">{t("sections.1.content.p1_1")}</p>
        <p className="text-gray-600">{t("sections.1.content.p1_2")}</p>
      </section>

      {/* Section 2: Terms and Definitions */}
      <section id="terms-definitions" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.2.title")}
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800">
              {t("sections.2.content.terms.site.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("sections.2.content.terms.site.description")}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              {t("sections.2.content.terms.user.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("sections.2.content.terms.user.description")}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              {t("sections.2.content.terms.account.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("sections.2.content.terms.account.description")}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              {t("sections.2.content.terms.digitalGoods.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("sections.2.content.terms.digitalGoods.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Registration and Account */}
      <section id="registration-account" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.3.title")}
        </h2>
        <div className="mb-4 p-3 bg-amber-50 rounded border border-amber-200">
          <p className="text-amber-800 text-sm mb-0">
            {t("sections.3.content.info")}
          </p>
        </div>
        <p className="text-gray-600 mb-3">{t("sections.3.content.p3_1")}</p>
        <p className="text-gray-600">{t("sections.3.content.p3_2")}</p>
      </section>

      {/* Section 4: Terms of Use */}
      <section id="terms-of-use" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.4.title")}
        </h2>
        <p className="text-gray-600 mb-3">{t("sections.4.content.p4_1")}</p>
        <div>
          <p className="font-medium text-gray-800 mb-2">
            {t("sections.4.content.p4_2.title")}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {t
              .raw("sections.4.content.p4_2.itemsList")
              .map((item: string, index: number) => (
                <li key={index} className="text-gray-600 text-sm">
                  {item}
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* Section 5: Purchase of Digital Goods */}
      <section id="digital-goods-purchase" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.5.title")}
        </h2>
        <div className="mb-4 p-3 bg-red-50 rounded border border-red-200">
          <p className="text-red-800 text-sm mb-0">
            {t("sections.5.content.warning")}
          </p>
        </div>
        <p className="text-gray-600 mb-3">{t("sections.5.content.p5_1")}</p>
        <p className="text-gray-600">{t("sections.5.content.p5_2")}</p>
      </section>

      {/* Section 6: Intellectual Property */}
      <section id="intellectual-property" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.6.title")}
        </h2>
        <p className="text-gray-600 mb-3">{t("sections.6.content.p6_1")}</p>
        <p className="text-gray-600">{t("sections.6.content.p6_2")}</p>
      </section>

      {/* Section 7: Confidentiality */}
      <section id="confidentiality" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.7.title")}
        </h2>
        <div className="mb-4 p-3 bg-green-50 rounded border border-green-200">
          <p className="text-green-800 text-sm mb-0">
            {t.rich("sections.7.content.info", {
              link: (chunks: any) => (
                <Link href="/contact" className="text-green-700 underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
        <p className="text-gray-600 mb-3">{t("sections.7.content.p7_1")}</p>
        <p className="text-gray-600">{t("sections.7.content.p7_2")}</p>
      </section>

      {/* Section 8: Limitation of Liability */}
      <section id="liability-limitation" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.8.title")}
        </h2>
        <p className="text-gray-600 mb-3">{t("sections.8.content.p8_1")}</p>
        <p className="text-gray-600">{t("sections.8.content.p8_2")}</p>
      </section>

      {/* Section 9: Account Termination */}
      <section id="account-termination" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.9.title")}
        </h2>
        <p className="text-gray-600">{t("sections.9.content.p9_1")}</p>
      </section>

      {/* Section 10: Force Majeure */}
      <section id="force-majeure" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.10.title")}
        </h2>
        <p className="text-gray-600">{t("sections.10.content.p10_1")}</p>
      </section>

      {/* Section 11: Payment Terms */}
      <section id="payment-conditions" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.11.title")}
        </h2>
        <p className="text-gray-600 mb-3">{t("sections.11.content.p11_1")}</p>
        <p className="text-gray-600">{t("sections.11.content.p11_2")}</p>
      </section>

      {/* Section 12: Refunds */}
      <section id="refunds" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.12.title")}
        </h2>
        <p className="text-gray-600 mb-3">{t("sections.12.content.p12_1")}</p>
        <p className="text-gray-600">{t("sections.12.content.p12_2")}</p>
      </section>

      {/* Section 13: Third Party Liability */}
      <section id="third-party-liability" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.13.title")}
        </h2>
        <p className="text-gray-600">{t("sections.13.content.p13_1")}</p>
      </section>

      {/* Section 14: Applicable Law */}
      <section id="applicable-law" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.14.title")}
        </h2>
        <p className="text-gray-600 mb-3">{t("sections.14.content.p14_1")}</p>
        <p className="text-gray-600 mb-3">{t("sections.14.content.p14_2")}</p>
        <p className="text-gray-600">{t("sections.14.content.p14_3")}</p>
      </section>

      {/* Section 15: Agreement Changes */}
      <section id="agreement-changes" className="mb-16 pt-4 scroll-mt-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {t("sections.15.title")}
        </h2>
        <p className="text-gray-600 mb-3">{t("sections.15.content.p15_1")}</p>
        <p className="text-gray-600">{t("sections.15.content.p15_2")}</p>
      </section>

      {/* Footer */}
      <div className="mt-12 p-4 bg-gray-50 rounded-lg border">
        <p className="text-gray-700 text-center font-medium">
          {t("conclusion")}
        </p>
      </div>
    </div>
  );
}
