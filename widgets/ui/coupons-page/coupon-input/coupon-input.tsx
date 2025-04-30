"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface CouponInputWidgetProps {
  onApply: (code: string) => void;
}

export function CouponInputWidget({ onApply }: CouponInputWidgetProps) {
  const [inputCode, setInputCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onApply(inputCode);
    }
  };

  // Mobile version (unchanged)
  const mobileVersion = (
    <div className="bg-gray-50 p-6 rounded-lg">
      <form onSubmit={handleSubmit} className="flex items-center flex-col">
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Введите промокод"
          className="flex-1 p-3 bg-white rounded-lg border border-gray-200 mr-2 w-full"
        />
        <button
          type="submit"
          className={`px-4 py-3 rounded-lg mt-3 w-full ${
            inputCode.trim()
              ? "bg-blue text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-700"
          } transition-colors`}
          disabled={!inputCode.trim()}
        >
          Применить
        </button>
      </form>
    </div>
  );

  // Desktop version (enhanced)
  const desktopVersion = (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-10 shadow-sm border border-gray-200">
      <div className="mb-8">
        <h3 className="text-2xl font-medium text-gray-800 mb-3 font-unbounded">
          Введите ваш промокод
        </h3>
        <p className="text-gray-600">
          Введите промокод, чтобы получить скидку на ваш следующий заказ
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div
            className={`absolute inset-0 bg-blue-100 rounded-lg opacity-0 transition-opacity duration-300 ${
              isFocused ? "opacity-20" : ""
            }`}
          ></div>
          <div className="relative">
            <Sparkles
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Например: SUMMER2025"
              className="w-full p-4 pl-12 bg-white rounded-lg border border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className={`w-full py-4 rounded-lg text-lg font-medium transition-all duration-300 ${
            inputCode.trim()
              ? "bg-blue text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
              : "bg-gray-300 text-gray-700"
          }`}
          disabled={!inputCode.trim()}
        >
          Применить промокод
        </motion.button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Где найти промокоды?
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• В нашем Telegram-канале</li>
          <li>• В email-рассылке</li>
          <li>• После совершения покупок</li>
          <li>• В специальных акциях и предложениях</li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <div className="block md:hidden">{mobileVersion}</div>
      <div className="hidden md:block">{desktopVersion}</div>
    </>
  );
}
