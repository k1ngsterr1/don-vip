"use client";

import type React from "react";
import { Button } from "@/shared/ui/button/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function ReviewForm() {
  const [reviewText, setReviewText] = useState("");
  const [sentiment, setSentiment] = useState<"positive" | "negative" | null>(
    null
  );
  const i18n = useTranslations("ReviewForm");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewText("");
    setSentiment(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="border-[1px] border-[#929294] rounded-lg w-full overflow-hidden">
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder={i18n("placeholder")}
          className="w-full p-4 min-h-[150px] outline-none resize-none"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setSentiment("positive")}
            className={`p-2 rounded-full ${
              sentiment === "positive" ? "bg-[#eafff4]" : ""
            }`}
            aria-label={i18n("positiveLabel")}
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
            className={`p-2 rounded-full ${
              sentiment === "negative" ? "bg-[#ffeeee]" : ""
            }`}
            aria-label={i18n("negativeLabel")}
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
            reviewText.trim() && sentiment !== null
              ? "bg-blue text-white hover:bg-blue/90"
              : "bg-[#AAAAAB] text-white hover:bg-gray-400"
          }`}
          disabled={!reviewText.trim() || sentiment === null}
        >
          {i18n("submitButton")}
        </Button>
      </div>
    </form>
  );
}
