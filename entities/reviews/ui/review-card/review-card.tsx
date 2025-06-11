"use client";

import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Review } from "../../model/types";

import { useTranslations } from "next-intl";
import { User } from "@/entities/user/model/types";

type ReviewWithUser = Review & {
  user?: User | null;
};

interface ReviewCardProps {
  review: ReviewWithUser;
  isGrid?: boolean;
}

export function ReviewCard({ review, isGrid = false }: ReviewCardProps) {
  const i18n = useTranslations("reviewCard");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  useEffect(() => {
    console.log("review", review);
  }, [review]);

  // Get author name - use anonymous if first_name is null
  const authorName = review.author || i18n("anonymous");

  // Get avatar from user object
  const avatar = review.avatar || null;

  // Get reaction (liked/disliked)
  const reaction = review.liked;

  // Safely access nested properties
  const hasProductImage = review.product && review.product.image;
  const productImage = hasProductImage
    ? review.product.image
    : "/placeholder.svg";

  // Get product name for game
  const gameName = review.product?.name || review.game || "";

  // Mobile version
  const mobileCard = (
    <div className="p-4 bg-gray-50 rounded-md mb-2 overflow-hidden">
      <div className="flex items-center mb-1">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
          {avatar ? (
            <Image
              src={avatar || "/placeholder.svg"}
              alt={authorName}
              width={40}
              height={40}
              className="object-cover h-full rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-blue flex items-center justify-center text-white">
              {authorName.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col items-start">
            <span className="text-blue font-medium truncate w-full">
              {authorName}
            </span>
            <span className="text-xs text-gray-light truncate w-full">
              {review.date || ""}
            </span>
          </div>
        </div>
        {reaction !== undefined && (
          <div className="flex-shrink-0 ml-2">
            {reaction ? (
              <ThumbsUp
                className="text-[#03cc60]"
                size={20}
                aria-label={i18n("likedReview")}
              />
            ) : (
              <ThumbsDown
                className="text-red-500"
                size={20}
                aria-label={i18n("dislikedReview")}
              />
            )}
          </div>
        )}
      </div>

      {review.text && (
        <div className="relative mt-2">
          {review.text.length > 150 && !isMobileExpanded ? (
            <>
              <p className="text-sm text-dark break-words">{`${review.text.substring(
                0,
                150
              )}...`}</p>
              <button
                onClick={() => setIsMobileExpanded(true)}
                className="text-blue text-xs mt-1 hover:underline"
              >
                {i18n("readMore") || "Читать полностью"}
              </button>
            </>
          ) : (
            <p className="text-sm text-dark break-words">{review.text}</p>
          )}
          {review.text.length > 150 && isMobileExpanded && (
            <button
              onClick={() => setIsMobileExpanded(false)}
              className="text-blue text-xs mt-1 hover:underline"
            >
              {i18n("collapse")}
            </button>
          )}
        </div>
      )}

      {gameName && (
        <div className="flex gap-2 mt-2 items-center overflow-hidden">
          {hasProductImage && (
            <Image
              src={productImage || "/placeholder.svg"}
              alt={gameName}
              width={40}
              height={40}
              className="object-cover rounded-full w-[18px] h-[18px] flex-shrink-0"
            />
          )}
          <p className="text-blue text-sm truncate">{gameName}</p>
        </div>
      )}
    </div>
  );

  // Desktop/Tablet card
  const desktopCard = (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex items-start mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-gray-100 flex-shrink-0">
          {avatar ? (
            <Image
              src={avatar || "/placeholder.svg"}
              alt={authorName}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <div
              className="w-full h-full bg-gray-300 flex items-center justify-center text-white"
              aria-label={i18n("noAvatar")}
            >
              {authorName.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="min-w-0 pr-2">
              <h3 className="font-medium text-lg text-gray-800 truncate">
                {authorName}
              </h3>
              {review.date && (
                <span className="text-sm text-gray-500 block truncate">
                  {review.date}
                </span>
              )}
            </div>
            {reaction !== undefined && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 flex-shrink-0">
                {reaction ? (
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
            )}
          </div>

          {gameName && hasProductImage && (
            <div className="flex items-center mt-2 bg-blue/10 px-3 py-1 rounded-full w-fit max-w-full">
              <Image
                src={productImage || "/placeholder.svg"}
                alt={gameName}
                width={40}
                height={40}
                className="object-cover w-4 h-4 mr-2 rounded-full flex-shrink-0"
              />
              <p className="text-blue text-xs font-medium truncate">
                {gameName}
              </p>
            </div>
          )}
        </div>
      </div>

      {review.text && (
        <div className="relative">
          {review.text.length > 150 && !isExpanded ? (
            <>
              <p className="text-sm text-gray-700 break-words">{`${review.text.substring(
                0,
                150
              )}...`}</p>
              <button
                onClick={() => setIsExpanded(true)}
                className="text-blue text-xs mt-2 hover:underline"
              >
                {i18n("readMore") || "Читать полностью"}
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-700 break-words">{review.text}</p>
          )}
          {review.text.length > 150 && isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-blue text-xs mt-2 hover:underline"
            >
              {i18n("collapse") || "Свернуть"}
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
