"use client";

import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Review } from "../../model/types";
import { useTranslations } from "next-intl";

interface ReviewCardProps {
  review: Review;
  isGrid?: boolean;
}

export function ReviewCard({ review, isGrid = false }: ReviewCardProps) {
  const i18n = useTranslations("reviewCard");
  const [isExpanded, setIsExpanded] = useState(false);

  // Mobile version (unchanged)
  const mobileCard = (
    <div className="p-4 bg-gray-50 rounded-md mb-2">
      <div className="flex items-center mb-1">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          {review.avatar ? (
            <Image
              src={review.avatar || "/placeholder.svg"}
              alt={review.author}
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-blue flex items-center justify-center text-white">
              {review.author.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 ">
          <div className="flex flex-col items-start">
            <span className="text-blue font-medium">{review.author}</span>
            <span className="text-xs text-gray-light">{review.date}</span>
          </div>
        </div>
        {review.liked ? (
          <ThumbsUp
            className={"text-[#03cc60]"}
            size={20}
            aria-label={i18n("likedReview")}
          />
        ) : (
          <ThumbsDown
            className={"text-red-500"}
            size={20}
            aria-label={i18n("dislikedReview")}
          />
        )}
      </div>
      {review.text && <p className="text-sm text-dark mt-2">{review.text}</p>}
      {review.game && (
        <div className="flex gap-2 mt-2">
          <Image
            src={review.product.image}
            alt={review.author}
            width={40}
            height={40}
            className="object-cover rounded-full w-[18px] h-[18px]"
          />
          <p className="text-blue text-sm ">{review.game}</p>
        </div>
      )}
    </div>
  );

  // Desktop/Tablet card
  const desktopCard = (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-gray-100">
          {review.avatar ? (
            <Image
              src={review.avatar || "/placeholder.svg"}
              alt={review.author}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <div
              className="w-full h-full bg-gray-300 flex items-center justify-center text-white"
              aria-label={i18n("noAvatar")}
            >
              {review.author.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg text-gray-800">
                {review.author}
              </h3>
              {review.date && (
                <span className="text-sm text-gray-500">{review.date}</span>
              )}
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50">
              {review.liked ? (
                <ThumbsUp
                  className="text-[#03cc60]"
                  size={16}
                  aria-label={i18n("likedReview")}
                />
              ) : (
                <ThumbsDown
                  className="text-red-500"
                  size={16}
                  aria-label={i18n("dislikedReview")}
                />
              )}
            </div>
          </div>

          {review.game && (
            <div className="flex items-center mt-2 bg-blue/10 px-3 py-1 rounded-full w-fit">
              <Image
                src={review.product.image}
                alt={review.author}
                width={40}
                height={40}
                className="object-cover w-4 h-4 mr-2 rounded-full"
              />
              <p className="text-blue text-xs font-medium">{review.game}</p>
            </div>
          )}
        </div>
      </div>

      {review.text && (
        <div className="relative">
          <p
            className={`text-gray-700 ${
              isExpanded ? "" : "line-clamp-3"
            } text-sm leading-relaxed`}
          >
            {review.text}
          </p>
          {review.text.length > 150 && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent"></div>
          )}
          {review.text.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue text-xs mt-2 hover:underline"
            >
              {isExpanded ? i18n("collapse") : i18n("readMore")}
            </button>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center text-gray-500 text-sm">
          <MessageSquare size={14} className="mr-1" />
          <span>{i18n("reply")}</span>
        </div>
        <div className="text-xs text-gray-400">
          {i18n("idLabel")}
          {review.id}
        </div>
      </div>
    </div>
  );

  return <>{isGrid ? desktopCard : mobileCard}</>;
}
