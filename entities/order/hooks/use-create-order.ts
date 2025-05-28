"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { orderApi } from "../api/order.api";
import { queryKeys } from "@/shared/config/queryKeys";
import type { CreateOrderDto } from "../model/types";
import type { PagsmileCreatePayinDto } from "@/entities/payment/model/types";
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
export function useCreateOrder(isTbank = false) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { user: authUser, isGuestAuth } = useAuthStore();
  const { data: me } = useGetMe();

  // 🔐 Resolve user ID from any source
  const resolveUserId = (): string | null => {
    if (authUser?.id) return authUser.id.toString();
    if (me?.id) return me.id.toString();
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
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

      if (!userId) {
        throw new Error("User ID is required to create an order");
      }

      if (!orderData.identifier) {
        throw new Error("Identifier (email or phone) is required");
      }

      // Map frontend fields to backend API fields - INCLUDE IDENTIFIER
      const apiOrderData = {
        identifier: orderData.identifier, // ✅ Make sure this is included
        product_id: orderData.game_id,
        item_id: orderData.currency_id,
        payment: orderData.payment_method,
        account_id: orderData.user_game_id,
        server_id: orderData.server_id,
        user_id: Number.parseInt(userId, 10),
      };

      console.log("🚀 Sending order data to API:", apiOrderData); // Debug log

      return orderApi.createOrder(apiOrderData as any);
    },

    onSuccess: (orderData, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      if (isTbank) {
        return;
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

  // 💰 Payment mutation
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
        if (isSafariBrowser()) {
          alert("Сейчас откроется платёжная страница");
        }
        window.open(paymentData.web_url, "_blank");
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

  // ⏳ Trigger payment after successful order
  const processPayment = (orderId: string, orderData: CreateOrderDto) => {
    setIsProcessingPayment(true);

    const paymentData: any = {
      order_id: orderId,
      amount:
        typeof orderData.price === "string"
          ? orderData.price
          : orderData.price.toFixed(2),
    };

    paymentMutation.mutate(paymentData);
  };

  return {
    createOrder: orderMutation.mutateAsync,
    isLoading: orderMutation.isPending || isProcessingPayment,
    isProcessingPayment,
    isSuccess: orderMutation.isSuccess && paymentMutation.isSuccess,
    isError: orderMutation.isError || paymentMutation.isError,
    error,
    setError,
    isGuestUser:
      isGuestAuth ||
      (!authUser &&
        typeof window !== "undefined" &&
        !!localStorage.getItem("userId")),
    needsIdentifier: !getUserIdentifier(),
  };
}
