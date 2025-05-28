"use client";

import type React from "react";
import { useState } from "react";

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
}: GuestAuthPopupProps) {
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
      setError("Please enter your email or phone number");
      return;
    }

    if (!validateIdentifier(identifier)) {
      setError(
        "Please enter a valid email or phone number (e.g., +77001112233)"
      );
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Contact Information Required
          </h2>
          <p className="text-gray-600 text-sm">
            Please provide your email or phone number to complete the order.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email or Phone Number
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="user@example.com or +77001112233"
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !identifier.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
