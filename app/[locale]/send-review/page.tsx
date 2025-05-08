"use client";
import { ReviewForm } from "@/entities/reviews/ui/submit-review/submit-review";
import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { Edit2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SendReview() {
  const i18n = useTranslations("SendReview");
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId")
    ? Number.parseInt(searchParams.get("gameId")!, 10)
    : undefined;

  return (
    <ContentWrapper>
      <div className="w-full px-[11px] mt-[24px] flex flex-col items-center">
        <div className="w-full flex items-start justify-start mb-[24px]">
          <Link href={"/reviews"} className="text-blue text-[15px] font-roboto">
            {i18n("backLink")}
          </Link>
        </div>
        <div className="w-full flex items-start justify-start">
          <SectionTitle
            icon={<Edit2Icon className="text-blue" size={16} />}
            title={i18n("title")}
          />
        </div>
        <ReviewForm gameId={gameId} redirectPath="/reviews" />
      </div>
    </ContentWrapper>
  );
}
