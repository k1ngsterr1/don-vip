"use client";

import { cn } from "@/shared/utils/cn";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  index: number;
  onToggle: (index: number) => void;
  enhanced?: boolean;
}

const formatAnswer = (answerHtml: string) => {
  return <div dangerouslySetInnerHTML={{ __html: answerHtml }} />;
};

export default function FAQItem({
  question,
  answer,
  isOpen,
  index,
  onToggle,
  enhanced = false,
}: FAQItemProps) {
  const contentId = `faq-content-${enhanced ? "desktop" : "mobile"}-${index}`;

  // Mobile/Default version
  if (!enhanced) {
    return (
      <div className="border-b border-gray-200 last:border-b-0 py-4">
        <button
          onClick={() => onToggle(index)}
          className="flex w-full items-center justify-between text-left focus:outline-none group"
          aria-expanded={isOpen}
          aria-controls={contentId}
        >
          <h3
            className={cn(
              "text-md font-medium transition-colors duration-200 group-hover:text-blue-600", // Icon color transition
              isOpen ? "text-blue-600" : "text-gray-800"
            )}
          >
            {question}
          </h3>
          <ChevronDown
            className={cn(
              "h-5 w-5 transform text-gray-400 transition-all duration-300 shrink-0 ml-2 group-hover:text-blue-600", // Chevron transform and color transition
              isOpen ? "rotate-180 text-blue-600" : "rotate-0"
            )}
          />
        </button>
        <div
          id={contentId}
          className={cn(
            "overflow-hidden text-sm text-gray-700 transition-all duration-500 ease-in-out", // Increased duration to 500ms
            isOpen
              ? "mt-2 max-h-[500px] opacity-100" // Ensure max-h is ample
              : "max-h-0 opacity-0"
          )}
          aria-hidden={!isOpen}
        >
          {/* Inner div for padding, visibility toggled with isOpen */}
          <div className={`px-0 pt-1 pb-1 ${isOpen ? "visible" : "invisible"}`}>
            {formatAnswer(answer)}
          </div>
        </div>
      </div>
    );
  }

  // Enhanced/Desktop version
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        className="flex w-full items-center justify-between px-6 py-5 text-left font-medium text-gray-900 focus:outline-none group"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        {question}
        <ChevronDown
          className={cn(
            "h-5 w-5 transform text-gray-500 transition-all duration-300 shrink-0 ml-2 group-hover:text-gray-700", // Chevron transform and color transition
            isOpen ? "rotate-180 text-gray-700" : "rotate-0"
          )}
        />
      </button>
      <div
        id={contentId}
        className={cn(
          "overflow-hidden bg-gray-50 transition-all duration-500 ease-in-out", // Increased duration to 500ms
          isOpen
            ? "max-h-[1000px] opacity-100" // Ensure max-h is ample
            : "max-h-0 opacity-0"
        )}
        aria-hidden={!isOpen}
      >
        {/* Inner div for padding and border, visibility toggled with isOpen */}
        <div
          className={`px-6 pb-5 pt-4 ${
            isOpen
              ? "border-t border-gray-100 visible"
              : "border-none invisible"
          }`}
        >
          <div className="prose max-w-none text-gray-700">
            {formatAnswer(answer)}
          </div>
        </div>
      </div>
    </div>
  );
}
