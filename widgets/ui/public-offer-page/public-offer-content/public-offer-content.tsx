"use client";
import { useTranslations } from "next-intl";
export default function PublicOfferContent() {
  const i18n = useTranslations("PublicOfferContent");

  return (
    <>
      {/* Section 1 */}
      <div
        id="section1" // Added ID for potential navigation
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-24" // Added scroll-mt
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {i18n("sections.general.title")}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {i18n("sections.general.1_1")}
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          {i18n("sections.general.1_2")}
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          {i18n("sections.general.1_3")}
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          {i18n("sections.general.1_4")}
        </p>
      </div>

      {/* Section 2 */}
      <div
        id="section2" // Added ID
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-24" // Added scroll-mt
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {i18n("sections.subject.title")}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {i18n("sections.subject.2_1")}
        </p>
      </div>

      {/* Section 3 */}
      <div
        id="section3" // Added ID
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-24" // Added scroll-mt
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {i18n("sections.order.title")}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {i18n("sections.order.3_1")}
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          {i18n("sections.order.3_2")}
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          {i18n("sections.order.3_3")}
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          {i18n("sections.order.3_4")}
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          {i18n("sections.order.3_5")}
        </p>
        <ul className="mt-4 space-y-2 list-disc pl-5">
          {" "}
          {/* Added list-disc and pl-5 */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <li key={item} className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span className="text-gray-700">
                {i18n(`sections.order.3_5_${item}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 4 */}
      <div
        id="section4" // Added ID
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-24" // Added scroll-mt
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {i18n("sections.payment.title")}
        </h2>
        {[1, 2, 3, 4, 5].map(
          (
            item,
            index // Added index for mt-4
          ) => (
            <p
              key={item}
              className={`text-gray-700 leading-relaxed ${
                index > 0 ? "mt-4" : ""
              }`}
            >
              {i18n(`sections.payment.4_${item}`)}
            </p>
          )
        )}
      </div>

      {/* Section 5 */}
      <div
        id="section5" // Added ID
        className="mb-8 pb-8 border-b border-gray-100 scroll-mt-24" // Added scroll-mt
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {i18n("sections.changes.title")}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {i18n("sections.changes.5_1")}
        </p>
      </div>

      {/* Section 6 */}
      <div id="section6" className="mb-8 scroll-mt-24">
        {" "}
        {/* Added scroll-mt */}
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {i18n("sections.other.title")}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {i18n("sections.other.6_1")}
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          {i18n("sections.other.6_2")}
        </p>
        {/* Paragraphs 6.3 to 6.9 are missing in the original, assuming they are part of the contact block */}
        <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-3">
            {i18n("sections.other.contactInfo")}
          </h3>
          {["business", "inn", "ogrip", "email"].map((item) => (
            <p key={item} className="text-gray-700">
              {i18n(`sections.other.${item}`)}
            </p>
          ))}

          <h3 className="font-medium text-gray-800 mt-6 mb-3">
            {i18n("sections.other.bankDetails")}
          </h3>
          {["account", "bank", "bic", "correspondentAccount"].map((item) => (
            <p key={item} className="text-gray-700">
              {i18n(`sections.other.${item}`)}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
