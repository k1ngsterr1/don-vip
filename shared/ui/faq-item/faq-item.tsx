"use client";

import { cn } from "@/shared/utils/cn";
import { Plus, X } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  index: number;
  onToggle: (index: number) => void;
}

const formatAnswer = (answerHtml: string) => {
  const formattedHtml = answerHtml.replace(/\n/g, "<br />");
  return <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />;
};

export default function FAQItem({
  question,
  answer,
  isOpen,
  index,
  onToggle,
}: FAQItemProps) {
  const contentId = `faq-content-${index}`;

  return (
    <div
      className={cn(
        "bg-white rounded-lg border",
        isOpen ? "border-blue-500" : "border-gray-300"
      )}
    >
      <button
        onClick={() => onToggle(index)}
        className="flex w-full items-center justify-between text-left focus:outline-none group p-4"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <h3
          className={cn(
            "text-sm font-medium",
            isOpen ? "text-blue-600" : "text-gray-800 group-hover:text-blue-500"
          )}
        >
          {question}
        </h3>
        {isOpen ? (
          <X className="h-5 w-5 text-blue-600 shrink-0 ml-2" />
        ) : (
          <Plus className="h-5 w-5 text-blue-600 shrink-0 ml-2" />
        )}
      </button>
      <div
        id={contentId}
        className={cn(
          "overflow-hidden text-sm text-gray-600 transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!isOpen}
      >
        <div className={`px-4 pb-4 pt-2 ${isOpen ? "visible" : "invisible"}`}>
          {formatAnswer(answer)}
        </div>
      </div>
    </div>
  );
}
