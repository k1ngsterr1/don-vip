"use client";
import { useTranslations } from "next-intl";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { ArrowLeft, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";

export function CouponsHeaderWidget() {
  const i18n = useTranslations("coupons");
  const router = useRouter();

  return (
    <>
      <div className="flex items-center mb-4 mt-[24px] md:mt-0">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-blue hover:text-blue-700 transition-colors flex items-center group"
        >
          <ArrowLeft
            size={16}
            className="mr-1 group-hover:-translate-x-1 transition-transform"
          />
          <span className="hover:underline">{i18n("backLink")}</span>
        </button>
      </div>
      <div className="flex items-center mb-6 md:mb-10">
        <SectionTitle
          icon={<Ticket className="text-blue" size={20} />}
          title={i18n("title")}
          className="md:text-center md:justify-center md:w-full"
          description={i18n("description")}
        />
      </div>
    </>
  );
}
