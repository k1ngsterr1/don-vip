"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Mail, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface IdentifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (identifier: string) => void;
}

export function IdentifierModal({
  isOpen,
  onClose,
  onSubmit,
}: IdentifierModalProps) {
  const t = useTranslations("identifier_popup");
  const [identifierInput, setIdentifierInput] = useState("");
  const [identifierType, setIdentifierType] = useState<"email" | "phone">(
    "email"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const trimmedInput = identifierInput.trim();
    if (trimmedInput.includes("@")) {
      setIdentifierType("email");
    } else if (
      trimmedInput.replace(/[^0-9]/g, "").length > 0 &&
      trimmedInput.length > 0
    ) {
      setIdentifierType("phone");
    }
    // If input is empty, retain current type or default (which is email)
  }, [identifierInput]);

  const validateInput = () => {
    if (!identifierInput.trim()) {
      setError(t("identifierRequired"));
      return false;
    }
    if (identifierType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifierInput)) {
        setError(t("invalidEmail"));
        return false;
      }
    } else {
      // Phone
      const digitsOnly = identifierInput.replace(/\D/g, "");
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        // Basic phone validation, adjust as needed
        setError(t("invalidPhone"));
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateInput()) {
      onSubmit(identifierInput);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIdentifierInput("");
      setError(null);
      // Optionally reset identifierType to default, e.g., "email"
      // setIdentifierType("email");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on overlay click
      role="dialog"
      aria-modal="true"
      aria-labelledby="identifier-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 sm:mx-auto transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            id="identifier-modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            {t("title")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label={t("closeModalAriaLabel") || "Close"}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="identifier-input" className="sr-only">
                {t("identifierInputLabel")}
              </label>
              <input
                id="identifier-input"
                placeholder={
                  identifierType === "email"
                    ? t("emailPlaceholder")
                    : t("phonePlaceholder")
                }
                value={identifierInput}
                onChange={(e) => setIdentifierInput(e.target.value)}
                type={identifierType === "email" ? "email" : "tel"}
                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {identifierType === "email" ? (
                  <Mail className="h-5 w-5 text-gray-400" />
                ) : (
                  <Phone className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="button"
              onClick={() => {
                setIdentifierType((prev) =>
                  prev === "email" ? "phone" : "email"
                );
                setIdentifierInput(""); // Clear input on type switch
                setError(null);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
            >
              {identifierType === "email"
                ? t("usePhoneInstead")
                : t("useEmailInstead")}
            </button>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row-reverse sm:space-x-3 sm:space-x-reverse">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2.5 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              {t("submit")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-6 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
