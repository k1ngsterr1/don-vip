"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function MobilePublicOffer() {
  const i18n = useTranslations("MobilePublicOffer");

  return (
    <div className="w-full px-[11px] mt-[24px] flex flex-col items-center md:hidden">
      <Link href={"/"} className="text-blue text-[15px] font-roboto">
        {i18n("backLink")}
      </Link>
      <h1 className="text-[14px] text-dark font-unbounded">{i18n("title")}</h1>
      <span className="text-[13px] text-left text-dark mt-[12px] font-roboto">
        <strong>{i18n("sections.general.title")}</strong>
        <br />
        <br />
        {i18n("sections.general.1_1")}
        <br />
        <br />
        {i18n("sections.general.1_2")}
        <br />
        <br />
        {i18n("sections.general.1_3")}
        <br />
        <br />
        {i18n("sections.general.1_4")}
        <br />
        <br />
        <strong>{i18n("sections.subject.title")}</strong>
        <br />
        <br />
        {i18n("sections.subject.2_1")}
        <br />
        <br />
        <strong>{i18n("sections.order.title")}</strong>
        <br />
        <br />
        {i18n("sections.order.3_1")}
        <br />
        <br />
        {i18n("sections.order.3_2")}
        <br />
        <br />
        {i18n("sections.order.3_3")}
        <br />
        <br />
        {i18n("sections.order.3_4")}
        <br />
        <br />
        {i18n("sections.order.3_5")}
        <br />
        <br />✔ {i18n("sections.order.3_5_1")}
        <br />
        <br />✔ {i18n("sections.order.3_5_2")}
        <br />
        <br />✔ {i18n("sections.order.3_5_3")}
        <br />
        <br />✔ {i18n("sections.order.3_5_4")}
        <br />
        <br />✔ {i18n("sections.order.3_5_5")}
        <br />
        <br />✔ {i18n("sections.order.3_5_6")}
        <br />
        <br />
        <strong>{i18n("sections.payment.title")}</strong>
        <br />
        <br />
        {i18n("sections.payment.4_1")}
        <br />
        <br />
        {i18n("sections.payment.4_2")}
        <br />
        <br />
        {i18n("sections.payment.4_3")}
        <br />
        <br />
        {i18n("sections.payment.4_4")}
        <br />
        <br />
        {i18n("sections.payment.4_5")}
        <br />
        <br />
        <strong>{i18n("sections.changes.title")}</strong>
        <br />
        <br />
        {i18n("sections.changes.5_1")}
        <br />
        <br />
        <strong>{i18n("sections.other.title")}</strong>
        <br />
        <br />
        {i18n("sections.other.6_1")}
        <br />
        <br />
        {i18n("sections.other.6_2")}
        <br />
        <br />
        {i18n("sections.other.6_3")}
        <br />
        <br />
        {i18n("sections.other.6_4")}
        <br />
        <br />
        {i18n("sections.other.6_5")}
        <br />
        <br />
        {i18n("sections.other.6_6")}
        <br />
        <br />
        {i18n("sections.other.6_7")}
        <br />
        <br />
        {i18n("sections.other.6_8")}
        <br />
        <br />
        {i18n("sections.other.6_9")}
      </span>
    </div>
  );
}
