"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { orderApi } from "../api/order.api";
import { queryKeys } from "@/shared/config/queryKeys";
import type { CreateOrderDto } from "../model/types";
import type {
  PagsmileCreatePayinDto,
  PagsmilePayinResponse,
} from "@/entities/payment/model/types";
import { paymentApi } from "@/entities/payment/api/payment.api";
import { useAuthStore } from "@/entities/auth/store/auth.store";

/**
 * Hook to create a new order and process payment
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { user } = useAuthStore();

  // Create order mutation
  const orderMutation = useMutation({
    mutationFn: (orderData: CreateOrderDto) => {
      // Transform the data to match the API structure shown in Swagger
      const apiOrderData = {
        product_id: orderData.game_id,
        item_id: orderData.currency_id,
        payment: orderData.payment_method,
        account_id: orderData.user_game_id,
        server_id: orderData.server_id,
      };

      return orderApi.createOrder(apiOrderData as any);
    },
    onSuccess: (orderData, variables) => {
      // Invalidate orders query to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });

      // After order is created, create payment
      processPayment(orderData.id.toString(), variables);
    },
    onError: (err: any) => {
      console.error("Order creation failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create order. Please try again."
      );
    },
  });

  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: (paymentData: PagsmileCreatePayinDto) => {
      let userId: string | null = null;

      if (user && user.id) {
        userId = user.id.toString();
      } else if (typeof window !== "undefined") {
        userId = localStorage.getItem("userId");
      }

      const paymentDataWithUser = {
        ...paymentData,
        user_id: userId,
      };

      // ✅ Возвращаем промис — важно!
      return paymentApi.createPagsmilePayin(paymentDataWithUser);
    },

    onSuccess: (paymentData: PagsmilePayinResponse) => {
      setIsProcessingPayment(false);

      if (paymentData.web_url) {
        window.open(paymentData.web_url, "_blank");
      }

      // router.push(`/product/success/${paymentData.out_trade_no}`);
    },

    onError: (err: any) => {
      setIsProcessingPayment(false);
      console.error("Payment processing failed:", err);
      setError(
        err.response?.data?.message ||
          "Payment processing failed. Please try again."
      );
    },
  });

  // Process payment after order creation
  const processPayment = (orderId: string, orderData: CreateOrderDto) => {
    setIsProcessingPayment(true);

    const paymentData: any = {
      order_id: orderId,
      // Format price as a decimal string (e.g., "100.00")
      amount:
        typeof orderData.price === "string"
          ? orderData.price
          : orderData.price.toFixed(2),
    };

    paymentMutation.mutate(paymentData);
  };

  return {
    createOrder: orderMutation.mutate,
    isLoading: orderMutation.isPending || isProcessingPayment,
    isProcessingPayment,
    isSuccess: orderMutation.isSuccess && paymentMutation.isSuccess,
    isError: orderMutation.isError || paymentMutation.isError,
    error,
    setError,
    isGuestUser:
      !user &&
      typeof window !== "undefined" &&
      !!localStorage.getItem("userId"),
  };
}
