"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAcceptedFeedbacks } from "@/entities/reviews/hook/use-feedback";
import { ReviewList } from "@/entities/reviews/ui/review-list/review-list";
import { FeedbackPrompt } from "@/widgets/ui/reviews-page/prompt-block/prompt-block";
import { ReviewsSkeleton } from "../reviews-loading/reviews-loading";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { AuthorizationPopup } from "@/entities/auth/ui/auth-popup/auth-popup";
import { userApi } from "@/entities/user/auth/user-api";

export function ReviewsBlock() {
  const t = useTranslations("reviews");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading, error } = useAcceptedFeedbacks(page, limit);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await userApi.getCurrentUser();
      setUser(userData as any);
    }
    fetchUser();
  }, []);

  const reviews: any[] = data?.data
    ? data.data.map((feedback: any) => {
        const isAnonymous =
          !feedback.user?.first_name && !feedback.user?.avatar;

        const review = {
          id: feedback.id.toString(),
          author:
            isAnonymous || !feedback.user?.first_name
              ? t("user") || t("user")
              : feedback.user.first_name,
          date: new Date().toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          product: feedback.product,
          text: feedback.text,
          liked: feedback.reaction === true,
          avatar: isAnonymous ? null : feedback.user?.avatar || null,
          isAnonymous,
          game: feedback.product?.name ?? undefined,
          image: feedback.product?.image ?? undefined,
        };
        return review;
      })
    : [];

  const handleLeaveReviewClick = () => {
    if (!isAuthenticated) {
      setIsAuthPopupOpen(true);
    }
  };

  return (
    <div className="w-full  min-h-[80vh] m-auto  mt-[24px] flex flex-col items-center">
      <FeedbackPrompt />
      <div className="w-full flex items-start mt-[15px] justify-start">
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
      {isAuthenticated ? (
        user?.is_verified ? (
          <Link
            href="/send-review"
            className="w-[194px] fixed flex items-center justify-center bottom-[75px] h-[42px] rounded-full font-roboto font-medium text-[12px] text-white bg-blue hover:bg-blue/90 transition-colors"
          >
            {t("page.leaveReview")}
          </Link>
        ) : (
          <button
            disabled
            className="w-[194px] fixed flex items-center justify-center bottom-[75px] h-[42px] rounded-full font-roboto font-medium text-[12px] text-white bg-gray-400 cursor-not-allowed"
          >
            {t("page.leaveReview")}
          </button>
        )
      ) : (
        <button
          onClick={handleLeaveReviewClick}
          className="w-[194px] fixed flex items-center justify-center bottom-[75px] h-[42px] rounded-full font-roboto font-medium text-[12px] text-white bg-blue hover:bg-blue/90 transition-colors"
        >
          {t("page.leaveReview")}
        </button>
      )}
      <AuthorizationPopup
        isOpen={isAuthPopupOpen}
        onOpenChange={setIsAuthPopupOpen}
      />
    </div>
  );
}
