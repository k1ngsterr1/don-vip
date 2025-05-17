"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  useAcceptedFeedbacks,
  useFeedbacks,
} from "@/entities/reviews/hook/use-feedback";
import { ReviewList } from "@/entities/reviews/ui/review-list/review-list";
import { FeedbackPrompt } from "@/widgets/ui/reviews-page/prompt-block/prompt-block";
import { ReviewsSkeleton } from "../reviews-loading/reviews-loading";

export function ReviewsBlock() {
  const t = useTranslations("reviews");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useAcceptedFeedbacks(page, limit);

  const reviews: any[] = data?.data
    ? data.data.map((feedback: any) => {
        const isAnonymous =
          !feedback.user?.first_name && !feedback.user?.avatar;

        return {
          id: feedback.id.toString(),
          author: isAnonymous
            ? t("anonymous.user") || "Anonymous User"
            : feedback.user?.first_name || `User ${feedback.user_id}`,
          date: new Date().toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          product: feedback.product,
          text: feedback.text,
          liked: feedback.reaction === true,
          avatar: isAnonymous ? null : feedback.user?.avatar || "/mavrodi.png",
          isAnonymous,
          game: feedback.product?.name ?? undefined,
          image: feedback.product?.image ?? undefined,
        };
      })
    : [];

  return (
    <div className="w-full md:max-w-[1680px] min-h-[80vh] m-auto px-[11px] mt-[24px] flex flex-col items-center">
      <FeedbackPrompt />
      <div className="w-full flex items-start justify-start">
        <button className="w-[78px] h-[30px] text-[10px] bg-gray-50 rounded-md mb-2">
          {t("filters.all")}
        </button>
      </div>

      {isLoading ? (
        <ReviewsSkeleton />
      ) : error ? (
        <div className="w-full text-center py-4 text-red-500">
          Error loading reviews: {error.message}
        </div>
      ) : reviews.length > 0 ? (
        <ReviewList reviews={reviews} />
      ) : (
        <div className="w-full text-center py-8 text-gray-500">
          <h3 className="text-lg font-medium mb-2">{t("empty.title")}</h3>
          <p>{t("empty.description")}</p>
        </div>
      )}
      {data && data.total > 0 && data.lastPage > 1 && (
        <div className="flex justify-center gap-2 mt-4 mb-16">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {page} of {data.lastPage}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, data.lastPage))}
            disabled={page === data.lastPage}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      <Link
        href="/send-review"
        className="w-[194px] fixed flex items-center justify-center bottom-[75px] h-[42px] rounded-full font-roboto font-medium text-[12px] text-white bg-blue"
      >
        {t("page.leaveReview")}
      </Link>
    </div>
  );
}
