"use client";

import type React from "react";
import { useState } from "react";
import { Loader2, CreditCard, Lock } from "lucide-react";
import Image from "next/image";

interface TBankPaymentFormProps {
  amount: string;
  price: string;
  currencyName: string;
  onPaymentComplete: (status: "success" | "error") => void;
}

export function TBankPaymentForm({
  amount,
  price,
  currencyName,
  onPaymentComplete,
}: TBankPaymentFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { phone?: string; password?: string } = {};

    if (!phoneNumber.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{10,12}$/.test(phoneNumber.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to T-Bank payment system
    setTimeout(() => {
      setIsSubmitting(false);
      // For demo purposes, always succeed
      onPaymentComplete("success");
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-6">
        <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center mr-3">
          <Image
            src="/t-bank-icon.png"
            width={24}
            height={24}
            alt="T-Bank"
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">T-Bank Payment</h3>
          <p className="text-xs text-gray-500">
            Fast and secure payment method
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.phone ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue focus:border-blue sm:text-sm`}
              placeholder="+7 (XXX) XXX-XX-XX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.password ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue focus:border-blue sm:text-sm`}
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between mb-4">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-sm font-medium">
              {amount} {currencyName}
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="text-sm font-medium">{price} RUB</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue text-white rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${price} RUB`
          )}
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          By clicking "Pay", you agree to T-Bank's terms and conditions.
        </p>
      </form>
    </div>
  );
}
