"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface Review {
  id: string;
  userName: string;
  avatar?: string;
  date: string;
  rating: number;
  comment: string;
  gameName?: string;
  gameIcon?: string;
  isPositive?: boolean;
}

interface ReviewsSectionProps {
  reviews?: Review[];
  metadata?: {
    totalReviews: number;
    averageRating: number;
  };
}

const defaultReviews: Review[] = [
  {
    id: "1",
    userName: "Dante Asmo",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    date: "15 сен. 2025 г. 14:30 ",
    rating: 5,
    comment:
      "Отличный сервис! Все пришло очень быстро. Сначала думал что развод, а нет, всё четко. Большое спасибо!",
    gameName: "Mobile Legends: Bang Bang",
    gameIcon: "/games/mlbb.jpg",
    isPositive: true,
  },
  {
    id: "2",
    userName: "Zhora Boroda",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    date: "28 авг. 2025 г. 18:45 ",
    rating: 1,
    comment:
      "Больше не обращусь к этому сервису! Из-за вас, моя борода выпала, а на голове выросли кучерявые волосы!",
    gameName: "Bigo Live",
    gameIcon: "/games/bigo.jpg",
    isPositive: false,
  },
  {
    id: "3",
    userName: "Davo Marshal",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    date: "3 сен. 2025 г. 21:15 ",
    rating: 5,
    comment:
      "Брат джан, спасибо за классный сервис! Кайфую, от скорости, всегда буду теперь тут покупать!",
    gameName: "Bigo Live",
    gameIcon: "/games/bigo.jpg",
    isPositive: true,
  },
];

export function ReviewsSection({
  reviews = [],
  metadata,
}: ReviewsSectionProps) {
  const t = useTranslations("orderBlock");
  const locale = useLocale();
  const [showAll, setShowAll] = useState(false);

  // Хардкодные переводы
  const translations = {
    ru: {
      reviews: "Отзывы",
      noReviews: "Пока нет отзывов для этой игры",
      beFirst: "Станьте первым, кто оставит отзыв!",
      showAllReviews: "Показать все отзывы",
    },
    en: {
      reviews: "Reviews",
      noReviews: "No reviews for this game yet",
      beFirst: "Be the first to leave a review!",
      showAllReviews: "Show all reviews",
    },
  };

  const reviewTexts =
    translations[locale as keyof typeof translations] || translations.ru;

  // Если отзывов нет из API, показываем пустое состояние
  if (!reviews || reviews.length === 0) {
    return (
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="bg-[#f3f4f7] px-3 py-2 rounded-lg">
            <span className="text-black text-xs font-light">
              {reviewTexts.reviews}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-3 h-3 fill-gray-300 text-gray-300"
                />
              ))}
            </div>
            <span className="text-gray-500 text-xs ml-1">
              {metadata?.totalReviews || 0}
            </span>
          </div>
        </div>

        {/* Empty state */}
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Star className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500 text-sm">{reviewTexts.noReviews}</p>
          <p className="text-gray-400 text-xs mt-1">{reviewTexts.beFirst}</p>

          {/* Show all reviews button even when empty */}
          <div className="mt-4">
            <Link
              href="/reviews"
              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
            >
              {reviewTexts.showAllReviews}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="bg-[#f3f4f7] px-3 py-2 rounded-lg">
          <span className="text-black text-xs font-light">
            {reviewTexts.reviews} {metadata ? `(3)` : `(3)`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {defaultReviews.slice(0, 3).map((review) => (
          <div key={review.id} className="bg-[#f3f4f7] rounded-lg p-3">
            {/* User info and like */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                  {review.avatar ? (
                    <Image
                      src={review.avatar}
                      alt={review.userName}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  )}
                </div>

                {/* Name and date */}
                <div>
                  <div className="text-blue-600 text-xs font-medium underline">
                    {review.userName}
                  </div>
                  <div className="text-gray-600 text-xs">{review.date}</div>
                </div>
              </div>

              {/* Like button */}
            </div>

            {/* Comment */}
            <div className="text-black text-xs font-light leading-relaxed mb-3">
              {review.comment}
            </div>

            {/* Game info */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-300 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500" />
              </div>
              <span className="text-blue-600 text-xs underline">
                {review.gameName}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Show all button */}
      {!showAll && reviews.length > 3 && (
        <div className="mt-6 text-center">
          <Link href="/reviews">
            <button
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 font-medium text-sm px-6 py-3 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
              type="button"
            >
              {reviewTexts.showAllReviews}
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
