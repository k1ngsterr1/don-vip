"use client";

import React, { useState } from "react";
import { EnhancedPaymentMethodSelector } from "@/entities/payment/ui/enhanced-payment-method-selector";
import type { PaymentMethod } from "@/entities/payment/api/payment-methods-api";

export function PaymentMethodTest() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    console.log("Selected payment method:", method);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payment Methods Test</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>

        <EnhancedPaymentMethodSelector
          selectedMethod={selectedPaymentMethod?.id}
          onSelect={handlePaymentMethodSelect}
          currentCurrency="USD"
          region="North America"
          amount={100}
          showRecommended={true}
          showFallback={true}
        />
      </div>

      {selectedPaymentMethod && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2">Selected Method:</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p>
              <strong>ID:</strong> {selectedPaymentMethod.id}
            </p>
            <p>
              <strong>Name:</strong> {selectedPaymentMethod.name}
            </p>
            <p>
              <strong>Type:</strong> {selectedPaymentMethod.type}
            </p>
            <p>
              <strong>Currency:</strong> {selectedPaymentMethod.currency}
            </p>
            <p>
              <strong>Region:</strong> {selectedPaymentMethod.region}
            </p>
            {selectedPaymentMethod.processing_fee && (
              <p>
                <strong>Processing Fee:</strong>{" "}
                {selectedPaymentMethod.processing_fee}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
