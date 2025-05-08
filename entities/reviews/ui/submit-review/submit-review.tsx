"use client";

import type React from "react";
import { Button } from "@/shared/ui/button/button";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCreateFeedback } from "../../hook/use-feedback";

interface ReviewFormProps {
  gameId?: number;
  redirectPath?: string;
}

export function ReviewForm({ gameId, redirectPath }: ReviewFormProps) {
  const [reviewText, setReviewText] = useState("");
  const [sentiment, setSentiment] = useState<"positive" | "negative" | null>(
    null
  );
  const i18n = useTranslations("ReviewForm");

  const {
    mutate: submitFeedback,
    isPending,
    isError,
    error,
    isSuccess,
    reset,
  } = useCreateFeedback({
    redirectPath,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewText.trim() || !sentiment) {
      return;
    }

    submitFeedback({
      text: reviewText,
      sentiment,
      gameId,
    });

    // Only clear form if there was no error
    if (!isError) {
      setReviewText("");
      setSentiment(null);
    }
  };

  const clearError = () => {
    reset();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="border-[1px] border-[#929294] rounded-lg w-full overflow-hidden">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={i18n("placeholder")}
            className="w-full p-4 min-h-[150px] outline-none resize-none"
            disabled={isPending}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setSentiment("positive")}
              className={`p-2 rounded-full transition-colors ${
                sentiment === "positive" ? "bg-[#eafff4]" : "hover:bg-gray-100"
              }`}
              aria-label={i18n("positiveLabel")}
              disabled={isPending}
            >
              <ThumbsUp
                className={
                  sentiment === "positive" ? "text-[#03cc60]" : "text-gray-300"
                }
                size={24}
              />
            </button>
            <button
              type="button"
              onClick={() => setSentiment("negative")}
              className={`p-2 rounded-full transition-colors ${
                sentiment === "negative" ? "bg-[#ffeeee]" : "hover:bg-gray-100"
              }`}
              aria-label={i18n("negativeLabel")}
              disabled={isPending}
            >
              <ThumbsDown
                className={
                  sentiment === "negative" ? "text-[#ff272c]" : "text-gray-300"
                }
                size={24}
              />
            </button>
          </div>
          <Button
            type="submit"
            className={`rounded-full px-6 font-bold ${
              reviewText.trim() && sentiment !== null && !isPending
                ? "bg-blue text-white hover:bg-blue/90"
                : "bg-[#AAAAAB] text-white hover:bg-gray-400"
            }`}
            disabled={!reviewText.trim() || sentiment === null || isPending}
          >
            {isPending ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {i18n("submitting") || "Submitting..."}
              </span>
            ) : (
              i18n("submitButton")
            )}
          </Button>
        </div>
      </form>

      {/* Error message */}
      {isError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle
            className="text-red-500 mr-2 flex-shrink-0 mt-0.5"
            size={16}
          />
          <div className="flex-1">
            <p className="text-red-700 text-sm">
              {error?.message ||
                "An error occurred while submitting your review."}
            </p>
            <button
              onClick={clearError}
              className="text-xs text-red-600 underline mt-1"
            >
              {i18n("dismissError") || "Dismiss"}
            </button>
          </div>
        </div>
      )}

      {/* Success message */}
      {isSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
          <CheckCircle
            className="text-green-500 mr-2 flex-shrink-0 mt-0.5"
            size={16}
          />
          <p className="text-green-700 text-sm">
            {i18n("successMessage") ||
              "Your review has been submitted successfully!"}
          </p>
        </div>
      )}
    </div>
  );
}
