"use client";

import type { useTranslations } from "next-intl";

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export function getFAQData(t: ReturnType<typeof useTranslations>): FAQItem[] {
  // Define all FAQ items using translations
  return [
    {
      question: t("paymentError.question"),
      answer: t("paymentError.answer"),
      category: "payment",
    },
    {
      question: t("wrongUid.question"),
      answer: t("wrongUid.answer"),
      category: "order",
    },
    {
      question: t("cancelOrder.question"),
      answer: t("cancelOrder.answer"),
      category: "order",
    },
    {
      question: t("orderProcessing.question"),
      answer: t("orderProcessing.answer"),
      category: "order",
    },
    {
      question: t("paymentNoDiamonds.question"),
      answer: t("paymentNoDiamonds.answer"),
      category: "payment",
    },
    {
      question: t("whatAreDiamonds.question"),
      answer: t("whatAreDiamonds.answer"),
      category: "products",
    },
    {
      question: t("howToTopUp.question"),
      answer: t("howToTopUp.answer"),
      category: "payment",
    },
    {
      question: t("findBigoId.question"),
      answer: t("findBigoId.answer"),
      category: "account",
    },
    {
      question: t("deliveryTime.question"),
      answer: t("deliveryTime.answer"),
      category: "delivery",
    },
    {
      question: t("paymentMethods.question"),
      answer: t("paymentMethods.answer"),
      category: "payment",
    },
    {
      question: t("isItSafe.question"),
      answer: t("isItSafe.answer"),
      category: "payment",
    },
    {
      question: t("howProductsDelivered.question"),
      answer: t("howProductsDelivered.answer"),
      category: "delivery",
    },
    {
      question: t("hasBot.question"),
      answer: t("hasBot.answer"),
      category: "support",
    },
    {
      question: t("orderDeliveryTime.question"),
      answer: t("orderDeliveryTime.answer"),
      category: "delivery",
    },
    {
      question: t("contactSupport.question"),
      answer: t("contactSupport.answer"),
      category: "support",
    },
    {
      question: t("createAccount.question"),
      answer: t("createAccount.answer"),
      category: "account",
    },
    {
      question: t("secureAccount.question"),
      answer: t("secureAccount.answer"),
      category: "account",
    },
    {
      question: t("accountHacked.question"),
      answer: t("accountHacked.answer"),
      category: "account",
    },
    {
      question: t("internalBalance.question"),
      answer: t("internalBalance.answer"),
      category: "payment",
    },
    {
      question: t("checkOrderStatus.question"),
      answer: t("checkOrderStatus.answer"),
      category: "order",
    },
    {
      question: t("getReceipt.question"),
      answer: t("getReceipt.answer"),
      category: "payment",
    },
    {
      question: t("regionalRestrictions.question"),
      answer: t("regionalRestrictions.answer"),
      category: "products",
    },
  ];
}
