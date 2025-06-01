"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function MobilePublicOffer() {
  const i18n = useTranslations("MobilePublicOffer");

  return (
    <div className="w-full px-[11px] mt-[24px] flex flex-col items-center md:hidden">
      <Link
        href={"/"}
        className="text-blue-600 text-[15px] font-roboto mb-4 self-start"
      >
        {" "}
        {/* Assuming text-blue-600 and added mb, self-start */}
        {i18n("backLink")}
      </Link>
      <h1 className="text-[14px] text-gray-800 font-unbounded font-bold mb-3 text-center">
        {" "}
        {/* Assuming text-gray-800 */}
        {i18n("title")}
      </h1>
      <div className="text-[13px] text-left text-gray-700 mt-[12px] font-roboto prose prose-sm max-w-none">
        {" "}
        {/* Assuming text-gray-700 and prose for better formatting */}
        <strong>{i18n("sections.general.title")}</strong>
        <p>{i18n("sections.general.1_1")}</p>
        <p>{i18n("sections.general.1_2")}</p>
        <p>{i18n("sections.general.1_3")}</p>
        <p>{i18n("sections.general.1_4")}</p>
        <strong>{i18n("sections.subject.title")}</strong>
        <p>{i18n("sections.subject.2_1")}</p>
        <strong>{i18n("sections.order.title")}</strong>
        <p>{i18n("sections.order.3_1")}</p>
        <p>{i18n("sections.order.3_2")}</p>
        <p>{i18n("sections.order.3_3")}</p>
        <p>{i18n("sections.order.3_4")}</p>
        <p>{i18n("sections.order.3_5")}</p>
        <ul className="list-disc pl-5">
          <li>✔ {i18n("sections.order.3_5_1")}</li>
          <li>✔ {i18n("sections.order.3_5_2")}</li>
          <li>✔ {i18n("sections.order.3_5_3")}</li>
          <li>✔ {i18n("sections.order.3_5_4")}</li>
          <li>✔ {i18n("sections.order.3_5_5")}</li>
          <li>✔ {i18n("sections.order.3_5_6")}</li>
        </ul>
        <strong>{i18n("sections.payment.title")}</strong>
        <p>{i18n("sections.payment.4_1")}</p>
        <p>{i18n("sections.payment.4_2")}</p>
        <p>{i18n("sections.payment.4_3")}</p>
        <p>{i18n("sections.payment.4_4")}</p>
        <p>{i18n("sections.payment.4_5")}</p>
        <strong>{i18n("sections.changes.title")}</strong>
        <p>{i18n("sections.changes.5_1")}</p>
        <strong>{i18n("sections.other.title")}</strong>
        <p>{i18n("sections.other.6_1")}</p>
        <p>{i18n("sections.other.6_2")}</p>
        <p>{i18n("sections.other.6_3")}</p>
        <p>{i18n("sections.other.6_4")}</p>
        <p>{i18n("sections.other.6_5")}</p>
        <p>{i18n("sections.other.6_6")}</p>
        <p>{i18n("sections.other.6_7")}</p>
        <p>{i18n("sections.other.6_8")}</p>
        <p>{i18n("sections.other.6_9")}</p>
      </div>
    </div>
  );
}
