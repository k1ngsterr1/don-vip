"use client";

import { Plus, X } from "lucide-react";
import type React from "react";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  index: number;
  onToggle: (index: number) => void;
  enhanced?: boolean;
}

export default function FAQItem({
  question,
  answer,
  isOpen,
  index,
  onToggle,
  enhanced = false,
}: FAQItemProps) {
  // Mobile version (unchanged)
  const mobileItem = (
    <div className={`border rounded-lg overflow-hidden border-blue`}>
      <button
        className="w-full px-4 py-3 text-left flex justify-between items-center focus:outline-none"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900 text-sm">{question}</span>
        {isOpen ? (
          <X className="h-5 w-5 text-blue-600" />
        ) : (
          <Plus className="h-5 w-5 text-blue-600" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 py-3 text-gray-700 text-sm">{answer}</div>
      )}
    </div>
  );

  // Enhanced version for desktop
  const desktopItem = (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white transition-all duration-200 hover:shadow-sm">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900 text-lg">{question}</span>
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            isOpen ? "bg-blue text-white" : "bg-gray-100 text-gray-500"
          }`}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="prose max-w-none text-gray-700">{answer}</div>
        </div>
      )}
    </div>
  );

  return enhanced ? desktopItem : mobileItem;
}
