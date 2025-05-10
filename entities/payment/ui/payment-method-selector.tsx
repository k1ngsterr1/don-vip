"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import tbank from "@/assets/T-Bank.webp";
import masterbank from "@/assets/mastercard.webp";

interface PaymentMethodSelectorProps {
  enhanced?: boolean;
  selectedMethod?: string;
  onSelect?: (method: string) => void;
}

export function PaymentMethodSelector({
  enhanced = false,
  selectedMethod = "tbank",
  onSelect = () => {},
}: PaymentMethodSelectorProps) {
  const i18n = useTranslations("PaymentMethodSelector");

  const paymentMethods = [
    { id: "tbank", name: i18n("methods.tbank"), icon: tbank },
    { id: "card", name: i18n("methods.card"), icon: masterbank },
  ];

  const mobileSelector = (
    <div className={enhanced ? "hidden" : "px-4 mb-6"}>
      <h2 className="text-dark font-medium mb-4">{i18n("titleMobile")}</h2>
      <div className="border border-gray-200 rounded-lg p-3 flex items-center">
        <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center mr-3">
          <span className="text-white font-bold">₸</span>
        </div>
        <span>{i18n("defaultMethod")}</span>
      </div>
    </div>
  );

  const desktopSelector = (
    <div className={enhanced ? "" : "hidden"}>
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        {i18n("titleDesktop")}
      </h2>
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border border-gray-200 rounded-lg p-4 flex items-center cursor-pointer transition-all ${
              method.id === selectedMethod
                ? "bg-blue/5 border-blue"
                : "hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => onSelect(method.id)}
          >
            <div className="w-10 h-10 rounded-md flex items-center justify-center mr-4 bg-gray-100">
              {method.icon ? (
                <Image
                  src={method.icon || "/placeholder.svg"}
                  width={24}
                  height={24}
                  alt={method.name}
                />
              ) : (
                <span className="text-gray-700 font-bold">₸</span>
              )}
            </div>
            <div className="flex-1">
              <span className="font-medium text-gray-800">{method.name}</span>
              {method.id === "tbank" && (
                <p className="text-xs text-gray-500 mt-1">
                  {i18n("tbankDescription")}
                </p>
              )}
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
              {method.id === selectedMethod && (
                <div className="w-3 h-3 rounded-full bg-blue"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {mobileSelector}
      {desktopSelector}
    </>
  );
}
