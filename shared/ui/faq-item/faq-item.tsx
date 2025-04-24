"use client";

import type React from "react";

import { Plus, X } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  index: number;
  onToggle: (index: number) => void;
}

export default function FAQItem({
  question,
  answer,
  isOpen,
  index,
  onToggle,
}: FAQItemProps) {
  return (
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
        <div className="px-4 py-3  text-gray-700 text-sm">{answer}</div>
      )}
    </div>
  );
}
