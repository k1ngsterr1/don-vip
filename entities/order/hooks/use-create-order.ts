"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { orderApi } from "../api/order.api";
import { queryKeys } from "@/shared/config/queryKeys";
import type { CreateOrderDto } from "../model/types";
import type {
  PagsmileCreatePayinDto,
  PagsmileCheckoutDto,
  PagsmileCheckoutResponse,
  MonetaCreatePayinDto,
  MonetaPayinResponse,
  DukPayCreatePayinDto,
  DukPayPayinResponse,
  Pay4GameCreatePaymentDto,
  Pay4GamePaymentResponse,
} from "@/entities/payment/model/types";
import { paymentApi } from "@/entities/payment/api/payment.api";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useGetMe } from "@/entities/auth/hooks/use-auth";
import { useOrderCookies } from "@/shared/hooks/use-order-cookies";

function isSafariBrowser(): boolean {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent;
  const isSafari =
    ua.indexOf("Safari") !== -1 &&
    ua.indexOf("Chrome") === -1 &&
    ua.indexOf("Chromium") === -1;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;

  return isSafari || isIOS;
}

/**
 * Hook to create a new order and process payment
 */
export function useCreateOrder(
  paymentMethod: string,
  currency: string = "RUB",
  isMonetaMethod: boolean = false,
  monetaMethodCode?: string,
  isDukPayMethod: boolean = false,
  dukPayMethodCode?: string,
  isPay4GameMethod: boolean = false,
  pay4GameMethodCode?: string
) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { user: authUser, isGuestAuth } = useAuthStore();
  const { data: me } = useGetMe();
  const { saveSuccessfulOrder, saveGameData, getOrCreateGuestId } =
    useOrderCookies();

  // Determine if we should use Pagsmile checkout (for non-RUB currencies)
  const shouldUsePagsmileCheckout = currency !== "RUB";

  // 🔐 Resolve user ID from any source
  const resolveUserId = (): string | null => {
    if (authUser?.id) return authUser.id.toString();
    if (me?.id) return me.id.toString();
    if (typeof window !== "undefined") {
      const localUserId = localStorage.getItem("userId");
      return localUserId && localUserId.trim() !== "" ? localUserId : null;
    }
    return null;
  };

  // 🔐 Get user identifier (email/phone)
  const getUserIdentifier = (): string | null => {
    if (authUser?.identifier) return authUser.identifier;
    if (me?.identifier) return me.identifier;
    if (authUser?.email) return authUser.email;
    if (me?.email) return me.email;
    return null;
  };

  // 🧾 Order creation mutation
  const orderMutation = useMutation({
    mutationFn: (orderData: CreateOrderDto) => {
      const userId = resolveUserId();

      if (!orderData.identifier) {
        throw new Error("Identifier (email or phone) is required");
      }

      // Проверяем, является ли это кастомным заказом
      const isCustomOrder = orderData.currency_id === -1;

      // Map frontend fields to backend API fields - INCLUDE IDENTIFIER AND COUPON CODE
      const apiOrderData: any = {
        identifier: orderData.identifier,
        product_id: orderData.game_id,
        item_id: isCustomOrder ? 0 : orderData.currency_id, // Для кастомных заказов используем 0
        payment: orderData.payment_method,
        account_id: orderData.user_game_id,
        server_id: orderData.server_id,
        coupon_code: orderData.coupon_code || undefined,
        user_id:
          userId && userId.trim() !== "" ? Number.parseInt(userId, 10) : null, // Явно устанавливаем null вместо undefined
      };

      // Для кастомных заказов добавляем custom_amount и custom_price
      if (isCustomOrder) {
        apiOrderData.custom_amount = orderData.amount;
        apiOrderData.custom_price =
          typeof orderData.price === "string"
            ? parseFloat(orderData.price)
            : orderData.price;
      }

      console.log("📦 Creating order with data:", apiOrderData);

      return orderApi.createOrder(apiOrderData as any);
    },

    onSuccess: (orderData, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });

      // Save successful order data to cookies
      saveSuccessfulOrder({
        orderId: orderData.id,
        accountId: variables.user_game_id,
        serverId: variables.server_id,
        gameId: variables.game_id,
        gameName: `Game ${variables.game_id}`, // You might want to pass actual game name
        timestamp: Date.now(),
      });

      // Save game data for quick access next time
      if (variables.user_game_id) {
        saveGameData({
          gameId: variables.game_id,
          accountId: variables.user_game_id,
          serverId: variables.server_id,
          gameName: `Game ${variables.game_id}`,
          lastUsed: Date.now(),
        });
      }

      // Ensure guest user has an ID saved
      if (!authUser && !me) {
        getOrCreateGuestId();
      }

      if (paymentMethod === "tbank" && currency === "RUB") {
        return; // T-Bank handles its own redirect
      } else {
        processPayment(orderData.id.toString(), variables);
      }
    },

    onError: (err: any) => {
      console.error("❌ Order creation failed:", err); // Debug log
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create order. Please try again."
      );
    },
  });

  // 💰 Payment mutation (for RUB currency)
  const paymentMutation = useMutation({
    mutationFn: (paymentData: PagsmileCreatePayinDto) => {
      const userId = resolveUserId();

      const paymentDataWithUser = {
        ...paymentData,
        user_id: userId,
      };

      return paymentApi.createPagsmilePayin(paymentDataWithUser as any);
    },

    onSuccess: (paymentData) => {
      setIsProcessingPayment(false);

      if (paymentData.web_url) {
        window.location.href = paymentData.web_url;
      }
    },

    onError: (err: any) => {
      setIsProcessingPayment(false);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Payment processing failed. Please try again."
      );
    },
  });

  // 💰 Pagsmile Checkout mutation (for non-RUB currencies)
  const checkoutMutation = useMutation({
    mutationFn: (checkoutData: PagsmileCheckoutDto) => {
      return paymentApi.createPagsmileCheckout(checkoutData);
    },

    onSuccess: (checkoutData: PagsmileCheckoutResponse) => {
      setIsProcessingPayment(false);

      if (checkoutData.webUrl) {
        window.location.href = checkoutData.webUrl;
      } else {
        setError("Failed to get checkout URL from payment provider");
      }
    },

    onError: (err: any) => {
      setIsProcessingPayment(false);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Checkout processing failed. Please try again."
      );
    },
  });

  // 💰 Moneta payment mutation
  const monetaMutation = useMutation({
    mutationFn: (monetaData: MonetaCreatePayinDto) => {
      const userId = resolveUserId();

      const monetaDataWithUser = {
        ...monetaData,
        user_id: userId ? Number.parseInt(userId, 10) : undefined,
      };

      return paymentApi.createMonetaPayin(monetaDataWithUser);
    },

    onSuccess: (monetaData: MonetaPayinResponse) => {
      setIsProcessingPayment(false);

      if (monetaData.paymentUrl) {
        window.location.href = monetaData.paymentUrl;
      } else {
        setError("Failed to get payment URL from Moneta");
      }
    },

    onError: (err: any) => {
      setIsProcessingPayment(false);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Moneta payment processing failed. Please try again."
      );
    },
  });

  // 💰 DukPay payment mutation
  const dukPayMutation = useMutation({
    mutationFn: (dukPayData: DukPayCreatePayinDto) => {
      const userId = resolveUserId();

      const dukPayDataWithUser = {
        ...dukPayData,
        user_id: userId ? Number.parseInt(userId, 10) : undefined,
      };

      return paymentApi.createDukPayPayin(dukPayDataWithUser);
    },

    onSuccess: (dukPayData: DukPayPayinResponse) => {
      setIsProcessingPayment(false);

      if (dukPayData.checkoutUrl) {
        window.location.href = dukPayData.checkoutUrl;
      } else {
        setError("Failed to get checkout URL from DukPay");
      }
    },

    onError: (err: any) => {
      setIsProcessingPayment(false);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "DukPay payment processing failed. Please try again."
      );
    },
  });

  // 💰 Pay4Game payment mutation
  const pay4GameMutation = useMutation({
    mutationFn: (pay4GameData: Pay4GameCreatePaymentDto) => {
      const userId = resolveUserId();

      const pay4GameDataWithUser = {
        ...pay4GameData,
        user_id: userId ? Number.parseInt(userId, 10) : undefined,
      };

      return paymentApi.createPay4GamePayment(pay4GameDataWithUser);
    },

    onSuccess: (pay4GameData: Pay4GamePaymentResponse) => {
      setIsProcessingPayment(false);

      if (pay4GameData.url) {
        window.location.href = pay4GameData.url;
      } else {
        setError("Failed to get payment URL from Pay4Game");
      }
    },

    onError: (err: any) => {
      setIsProcessingPayment(false);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Pay4Game payment processing failed. Please try again."
      );
    },
  });

  // Return the exact payment method selected by user
  const mapPaymentMethodToPagsmile = (method: string): string => {
    // Возвращаем точно тот метод, который выбрал пользователь
    return method;
  };

  // ⏳ Trigger payment after successful order
  const processPayment = (orderId: string, orderData: CreateOrderDto) => {
    setIsProcessingPayment(true);

    // Check if this is a Pay4Game payment method
    if (isPay4GameMethod) {
      const identifier =
        orderData.identifier || getUserIdentifier() || "customer@don-vip.com";

      // Map payment method code to Pay4Game method
      const getPay4GameMethod = (code?: string): string => {
        if (!code) return "sbp";

        const lowerCode = code.toLowerCase();
        if (lowerCode.includes("card")) return "card";
        if (lowerCode.includes("sberpay") || lowerCode.includes("sber"))
          return "sberpay";
        return "sbp"; // Default to SBP
      };

      // Map payment method code to SBP type (qr or url)
      const getSbpType = (code?: string): string => {
        if (!code) return "qr";
        const lowerCode = code.toLowerCase();
        if (lowerCode.includes("url")) return "url";
        return "qr"; // Default to QR
      };

      const pay4GameData: Pay4GameCreatePaymentDto = {
        order_id: Number.parseInt(orderId, 10),
        amount:
          typeof orderData.price === "string"
            ? orderData.price
            : orderData.price.toFixed(2),
        email: identifier.includes("@") ? identifier : `customer@don-vip.com`,
        method: getPay4GameMethod(pay4GameMethodCode),
        sbp_type: getSbpType(pay4GameMethodCode),
        description: `Order #${orderId}`,
      };

      pay4GameMutation.mutate(pay4GameData);
      return;
    }

    // Check if this is a DukPay payment method
    if (isDukPayMethod) {
      // Map payment method code to DukPay payment method
      const getDukPayMethod = (
        code?: string
      ): "BANK_CARD" | "YOOMONEY" | "SBER_PAY" => {
        if (!code) return "BANK_CARD";

        const upperCode = code.toUpperCase();
        if (upperCode.includes("YOOMONEY") || upperCode.includes("YOOMONEY")) {
          return "YOOMONEY";
        }
        if (upperCode.includes("SBER") || upperCode.includes("SBERPAY")) {
          return "SBER_PAY";
        }
        return "BANK_CARD";
      };

      const dukPayData: DukPayCreatePayinDto = {
        order_id: Number.parseInt(orderId, 10),
        amount:
          typeof orderData.price === "string"
            ? orderData.price
            : orderData.price.toFixed(2),
        country: "RUS",
        paymentMethod: getDukPayMethod(dukPayMethodCode),
        currency: "RUB",
        description: `Order #${orderId}`,
      };

      dukPayMutation.mutate(dukPayData);
      return;
    }

    // Check if this is a Moneta payment method
    if (isMonetaMethod) {
      const monetaData: MonetaCreatePayinDto = {
        order_id: Number.parseInt(orderId, 10),
        amount:
          typeof orderData.price === "string"
            ? orderData.price
            : orderData.price.toFixed(2),
        method: monetaMethodCode, // Use the code field from payment method
        description: `Order #${orderId}`,
      };

      monetaMutation.mutate(monetaData);
      return;
    }

    if (shouldUsePagsmileCheckout) {
      // Use Pagsmile checkout for non-RUB currencies
      const identifier =
        orderData.identifier || getUserIdentifier() || "customer";

      // Map the selected payment method to Pagsmile method
      const pagsmileMethod = mapPaymentMethodToPagsmile(paymentMethod);

      const checkoutData: PagsmileCheckoutDto = {
        orderId: orderId,
        amount:
          typeof orderData.price === "string"
            ? orderData.price
            : orderData.price.toFixed(2),
        currency: currency,
        region: getRegionFromCurrency(currency),
        method: pagsmileMethod, // Добавляем выбранный метод оплаты
        customer: {
          name: identifier.includes("@")
            ? identifier.split("@")[0]
            : "Customer",
          email: identifier.includes("@")
            ? identifier
            : `${identifier}@example.com`,
        },
      };

      checkoutMutation.mutate(checkoutData);
    } else {
      // Use regular payment for RUB currency
      const paymentData: any = {
        order_id: orderId,
        amount:
          typeof orderData.price === "string"
            ? orderData.price
            : orderData.price.toFixed(2),
        name:
          orderData.payment_method === "sbp" ||
          orderData.payment_method === "sbp_pagsmile"
            ? "SBP"
            : "Card",
      };

      paymentMutation.mutate(paymentData);
    }
  };

  // Helper function to get region from currency
  const getRegionFromCurrency = (currency: string): string => {
    const currencyToRegion: Record<string, string> = {
      USD: "North America",
      EUR: "Europe",
      BRL: "Brazil",
      // Add more currency mappings as needed
    };
    return currencyToRegion[currency] || "North America";
  };

  return {
    createOrder: orderMutation.mutateAsync,
    isLoading: orderMutation.isPending || isProcessingPayment,
    isProcessingPayment,
    isSuccess:
      orderMutation.isSuccess &&
      (isPay4GameMethod
        ? pay4GameMutation.isSuccess
        : isDukPayMethod
        ? dukPayMutation.isSuccess
        : isMonetaMethod
        ? monetaMutation.isSuccess
        : shouldUsePagsmileCheckout
        ? checkoutMutation.isSuccess
        : paymentMutation.isSuccess),
    isError:
      orderMutation.isError ||
      (isPay4GameMethod
        ? pay4GameMutation.isError
        : isDukPayMethod
        ? dukPayMutation.isError
        : isMonetaMethod
        ? monetaMutation.isError
        : shouldUsePagsmileCheckout
        ? checkoutMutation.isError
        : paymentMutation.isError),
    error,
    setError,
    isGuestUser:
      isGuestAuth ||
      (!authUser &&
        typeof window !== "undefined" &&
        !!localStorage.getItem("userId")),
    needsIdentifier: !getUserIdentifier(),
    shouldUsePagsmileCheckout,
  };
}
