"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

interface Review {
  id: number;
  userName: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
  gameName: string;
  gameIcon: string;
  isPositive: boolean;
}

interface ReviewsSectionProps {
  reviews?: Review[];
}

const defaultReviews: Review[] = [
  {
    id: 1,
    userName: "Dante Asmo",
    avatar: "/avatars/user1.jpg",
    date: "17 мар. 2025 г.",
    rating: 5,
    comment:
      "Отличный сервис! Все пришло очень быстро. Сначала думал что развод, а нет, всё четко. Большое спасибо!",
    gameName: "Mobile Legends: Bang Bang",
    gameIcon: "/games/mlbb.jpg",
    isPositive: true,
  },
  {
    id: 2,
    userName: "Zhora Boroda",
    avatar: "/avatars/user2.jpg",
    date: "15 мар. 2025 г.",
    rating: 1,
    comment:
      "Больше не обращусь к этому сервису! Из-за вас, моя борода выпала, а на голове выросли кучерявые волосы!",
    gameName: "Bigo Live",
    gameIcon: "/games/bigo.jpg",
    isPositive: false,
  },
  {
    id: 3,
    userName: "Davo Marshal",
    avatar: "/avatars/user3.jpg",
    date: "12 мар. 2025 г.",
    rating: 5,
    comment:
      "Брат джан, спасибо за классный сервис! Кайфую, от скорости, всегда буду теперь тут покупать!",
    gameName: "Bigo Live",
    gameIcon: "/games/bigo.jpg",
    isPositive: true,
  },
];

export function ReviewsSection({
  reviews = defaultReviews,
}: ReviewsSectionProps) {
  const t = useTranslations("orderBlock");
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="bg-[#f3f4f7] px-3 py-2 rounded-lg">
          <span className="text-black text-xs font-light">Отзывы</span>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="bg-[#f3f4f7] rounded-lg p-3">
            {/* User info and like */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
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
              <div className="text-lg">{review.isPositive ? "👍" : "👎"}</div>
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
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 text-sm font-medium"
          >
            Показать все отзывы
          </button>
        </div>
      )}
    </div>
  );
}
