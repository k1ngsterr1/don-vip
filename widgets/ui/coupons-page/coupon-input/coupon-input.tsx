"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface CouponInputWidgetProps {
  onApply: (code: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function CouponInputWidget({
  onApply,
  isLoading = false,
  error = null,
}: CouponInputWidgetProps) {
  const t = useTranslations("couponsInput.input");
  const [inputCode, setInputCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim() && !isLoading) {
      onApply(inputCode);
    }
  };

  // Mobile version
  const mobileVersion = (
    <div className="bg-gray-50 p-6 rounded-lg">
      <form onSubmit={handleSubmit} className="flex items-center flex-col">
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder={t("placeholder")}
          className="flex-1 p-3 bg-white rounded-lg border border-gray-200 mr-2 w-full"
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm mt-2 w-full">{error}</p>}
        <button
          type="submit"
          className={`px-4 py-3 rounded-lg mt-3 w-full ${
            inputCode.trim() && !isLoading
              ? "bg-blue text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-700"
          } transition-colors flex justify-center items-center`}
          disabled={!inputCode.trim() || isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            t("applyButton")
          )}
        </button>
      </form>
    </div>
  );

  // Desktop version (enhanced)
  const desktopVersion = (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-10 shadow-sm border border-gray-200">
      <div className="mb-8">
        <h3 className="text-2xl font-medium text-gray-800 mb-3 font-unbounded">
          {t("title")}
        </h3>
        <p className="text-gray-600">{t("description")}</p>
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
              placeholder={t("placeholderExample")}
              className="w-full p-4 pl-12 bg-white rounded-lg border border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className={`w-full py-4 rounded-lg text-lg font-medium transition-all duration-300 ${
            inputCode.trim() && !isLoading
              ? "bg-blue text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
              : "bg-gray-300 text-gray-700"
          } flex justify-center items-center`}
          disabled={!inputCode.trim() || isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            t("applyButtonLong")
          )}
        </motion.button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          {t("whereToFind.title")}
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• {t("whereToFind.telegram")}</li>
          <li>• {t("whereToFind.email")}</li>
          <li>• {t("whereToFind.purchases")}</li>
          <li>• {t("whereToFind.promotions")}</li>
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
