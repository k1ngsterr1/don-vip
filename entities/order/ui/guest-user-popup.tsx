"use client";

import { useTranslations } from "next-intl";
import type React from "react";
import { useState } from "react";

//

interface GuestAuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (identifier: string) => void;
  isLoading?: boolean;
}

export function GuestAuthPopup({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: // isForNonRubCurrency = false,/
GuestAuthPopupProps) {
  const i18n = useTranslations("popup");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");

  const validateIdentifier = (value: string): boolean => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Phone validation (E.164 format)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;

    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError(i18n("errorEmpty"));
      return;
    }

    if (!validateIdentifier(identifier)) {
      setError(i18n("errorInvalid"));
      return;
    }

    onSubmit(identifier);
  };

  const handleClose = () => {
    setIdentifier("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 bg-opacity-50"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {i18n("title")}
          </h2>
          <p className="text-gray-600 text-sm">{i18n("description")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {i18n("label")}
            </label>
            <input
              id="identifier"
              type="text"
              placeholder={i18n("placeholder")}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {i18n("cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading || !identifier.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? i18n("processing") : i18n("continue")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
