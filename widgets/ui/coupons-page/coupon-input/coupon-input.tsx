"use client";

import type React from "react";

import { useState } from "react";

interface CouponInputWidgetProps {
  onApply: (code: string) => void;
}

export function CouponInputWidget({ onApply }: CouponInputWidgetProps) {
  const [inputCode, setInputCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onApply(inputCode);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Введите промокод"
          className="flex-1 p-3 bg-white rounded-lg border border-gray-200 mr-2"
        />
        <button
          type="submit"
          className={`px-4 py-3 rounded-lg ${
            inputCode.trim()
              ? "bg-blue text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          disabled={!inputCode.trim()}
        >
          Применить
        </button>
      </form>
    </div>
  );
}
