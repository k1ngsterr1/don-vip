"use client";

import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface CouponInputWidgetProps {
  onApply: (code: string) => void;
  isLoading?: boolean;
  error?: string | null;
  isAvailable?: boolean; // New prop to control availability
}

export function CouponInputWidget({
  onApply,
  isLoading = false,
  error = null,
  isAvailable = false, // Default to available
}: CouponInputWidgetProps) {
  const t = useTranslations("couponsInput.input");
  const [inputCode, setInputCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim() && !isLoading && isAvailable) {
      onApply(inputCode);
    }
  };

  // Unavailable message
  const unavailableMessage = "Coupon codes are not available for this order";

  // Mobile version
  const mobileVersion = (
    <div
      className={`bg-gray-50 p-6 rounded-lg ${
        !isAvailable ? "opacity-80" : ""
      }`}
    >
      <form onSubmit={handleSubmit} className="flex items-center flex-col">
        {!isAvailable && (
          <div className="flex items-center mb-3 text-gray-500">
            <Lock size={16} className="mr-2" />
            <span className="text-sm">{unavailableMessage}</span>
          </div>
        )}

        <input
          type="text"
          value={inputCode}
          onChange={(e) => isAvailable && setInputCode(e.target.value)}
          placeholder={
            isAvailable ? t("placeholder") : "Coupon codes unavailable"
          }
          className={`flex-1 p-3 bg-white rounded-lg border mr-2 w-full transition-colors ${
            isAvailable
              ? "border-gray-200"
              : "border-gray-300 bg-gray-50 text-gray-400"
          }`}
          disabled={isLoading || !isAvailable}
        />

        {error && isAvailable && (
          <p className="text-red-500 text-sm mt-2 w-full">{error}</p>
        )}

        <button
          type="submit"
          className={`px-4 py-3 rounded-lg mt-3 w-full transition-colors flex justify-center items-center ${
            inputCode.trim() && !isLoading && isAvailable
              ? "bg-blue text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-700"
          } ${!isAvailable ? "cursor-not-allowed" : ""}`}
          disabled={!inputCode.trim() || isLoading || !isAvailable}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : !isAvailable ? (
            <Lock size={16} className="mr-2" />
          ) : (
            t("applyButton")
          )}
          {!isAvailable && "Unavailable"}
          {isAvailable && !isLoading && t("applyButton")}
        </button>
      </form>
    </div>
  );

  // Desktop version (enhanced)
  const desktopVersion = (
    <div
      className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-10 shadow-sm border border-gray-200 ${
        !isAvailable ? "opacity-90" : ""
      }`}
    >
      <div className="mb-8">
        <div className="flex items-center">
          <h3 className="text-2xl font-medium text-gray-800 mb-3 font-unbounded">
            {t("title")}
          </h3>
          {!isAvailable && (
            <span className="ml-3 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full uppercase tracking-wide">
              Unavailable
            </span>
          )}
        </div>
        <p className={`${isAvailable ? "text-gray-600" : "text-gray-500"}`}>
          {isAvailable ? t("description") : unavailableMessage}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div
            className={`absolute inset-0 bg-blue-100 rounded-lg opacity-0 transition-opacity duration-300 ${
              isFocused && isAvailable ? "opacity-20" : ""
            }`}
          ></div>
          <div className="relative">
            {isAvailable ? (
              <Sparkles
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            ) : (
              <Lock
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            )}
            <input
              type="text"
              value={inputCode}
              onChange={(e) => isAvailable && setInputCode(e.target.value)}
              onFocus={() => isAvailable && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                isAvailable
                  ? t("placeholderExample")
                  : "Coupon codes unavailable"
              }
              className={`w-full p-4 pl-12 rounded-lg border text-lg transition-all ${
                isAvailable
                  ? "bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  : "bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
              disabled={isLoading || !isAvailable}
            />
          </div>
        </div>

        {error && isAvailable && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!isAvailable && (
          <div className="bg-gray-100 border border-gray-200 text-gray-600 px-4 py-3 rounded-lg text-sm flex items-center">
            <Lock size={16} className="mr-2" />
            {unavailableMessage}
          </div>
        )}

        <motion.button
          whileHover={isAvailable ? { scale: 1.02 } : {}}
          whileTap={isAvailable ? { scale: 0.98 } : {}}
          type="submit"
          className={`w-full py-4 rounded-lg text-lg font-medium transition-all duration-300 flex justify-center items-center ${
            inputCode.trim() && !isLoading && isAvailable
              ? "bg-blue text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
              : "bg-gray-300 text-gray-700"
          } ${!isAvailable ? "cursor-not-allowed" : ""}`}
          disabled={!inputCode.trim() || isLoading || !isAvailable}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : !isAvailable ? (
            <>
              <Lock size={18} className="mr-2" />
              Coupons Unavailable
            </>
          ) : (
            t("applyButtonLong")
          )}
        </motion.button>
      </form>

      {isAvailable && (
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
      )}
    </div>
  );

  return (
    <>
      <div className="block md:hidden">{mobileVersion}</div>
      <div className="hidden md:block">{desktopVersion}</div>
    </>
  );
}
