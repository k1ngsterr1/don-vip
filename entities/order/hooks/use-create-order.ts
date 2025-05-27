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

  // Check if it's Safari
  // Safari includes "Safari" in UA but not "Chrome" or "Chromium"
  const isSafari =
    ua.indexOf("Safari") !== -1 &&
    ua.indexOf("Chrome") === -1 &&
    ua.indexOf("Chromium") === -1;

  // Additional check for iOS devices which use WebKit (similar to Safari)
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

  const { user: authUser } = useAuthStore();
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

  // 🧾 Order creation mutation
  const orderMutation = useMutation({
    mutationFn: (orderData: CreateOrderDto) => {
      const userId = resolveUserId();

      const apiOrderData = {
        product_id: orderData.game_id,
        item_id: orderData.currency_id,
        payment: orderData.payment_method,
        account_id: orderData.user_game_id,
        server_id: orderData.server_id,
        user_id: userId,
      };

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
      setError(
        err?.response?.data?.message ||
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
        // Show alert only in Safari to unblock window.open
        if (isSafariBrowser()) {
          alert("Сейчас откроется платёжная страница"); // ✅ разблокирует window.open в Safari
        }
        window.open(paymentData.web_url, "_blank");
      }

      // Optional redirect:
      // router.push(`/product/success/${paymentData.out_trade_no}`);
    },

    onError: (err: any) => {
      setIsProcessingPayment(false);
      setError(
        err?.response?.data?.message ||
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
      !authUser &&
      typeof window !== "undefined" &&
      !!localStorage.getItem("userId"),
  };
}
