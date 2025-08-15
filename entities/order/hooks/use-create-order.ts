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
} from "@/entities/payment/model/types";
import { paymentApi } from "@/entities/payment/api/payment.api";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useGetMe } from "@/entities/auth/hooks/use-auth";

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
  currency: string = "RUB"
) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { user: authUser, isGuestAuth } = useAuthStore();
  const { data: me } = useGetMe();

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

      // Map frontend fields to backend API fields - INCLUDE IDENTIFIER AND COUPON CODE
      const apiOrderData = {
        identifier: orderData.identifier,
        product_id: orderData.game_id,
        item_id: orderData.currency_id,
        payment: orderData.payment_method,
        account_id: orderData.user_game_id,
        server_id: orderData.server_id,
        coupon_code: orderData.coupon_code || undefined,
        user_id:
          userId && userId.trim() !== ""
            ? Number.parseInt(userId, 10)
            : undefined,
      };

      return orderApi.createOrder(apiOrderData as any);
    },

    onSuccess: (orderData, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
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

      if (checkoutData.success && checkoutData.data?.checkout_url) {
        window.location.href = checkoutData.data.checkout_url;
      } else {
        setError(checkoutData.error || "Failed to create checkout session");
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

  // ⏳ Trigger payment after successful order
  const processPayment = (orderId: string, orderData: CreateOrderDto) => {
    setIsProcessingPayment(true);

    if (shouldUsePagsmileCheckout) {
      // Use Pagsmile checkout for non-RUB currencies
      const identifier =
        orderData.identifier || getUserIdentifier() || "customer";
      const checkoutData: PagsmileCheckoutDto = {
        order_id: orderId,
        amount:
          typeof orderData.price === "string"
            ? orderData.price
            : orderData.price.toFixed(2),
        currency: currency,
        region: getRegionFromCurrency(currency),
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
        name: orderData.payment_method === "sbp" ? "SBP" : "Card",
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
      (shouldUsePagsmileCheckout
        ? checkoutMutation.isSuccess
        : paymentMutation.isSuccess),
    isError:
      orderMutation.isError ||
      (shouldUsePagsmileCheckout
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
