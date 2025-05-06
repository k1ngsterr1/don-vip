"use client";

import type { CreateOrderDto } from "@/entities/order/model/types";
import type {
  PagsmileCreatePayinDto,
  PagsmilePayinResponse,
} from "@/entities/payment/model/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { orderApi } from "../api/order.api";
import { paymentApi } from "@/entities/payment/api/payment.api";

/**
 * Hook to create a new order and process payment
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Create order mutation
  const orderMutation = useMutation({
    mutationFn: (orderData: CreateOrderDto) => {
      return orderApi.createOrder(orderData);
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
      return paymentApi.createPagsmilePayin(paymentData);
    },
    onSuccess: (paymentData: PagsmilePayinResponse) => {
      setIsProcessingPayment(false);

      // If there's a web_url, open it in a new tab
      if (paymentData.web_url) {
        // Open in a new tab
        window.open(paymentData.web_url, "_blank");

        // Also redirect the current page to the success page
        router.push(`/order/success/${paymentData.out_trade_no}`);
      } else {
        // Fallback if no web_url is provided
        router.push(`/order/success/${paymentData.out_trade_no}`);
      }
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

    const paymentData: PagsmileCreatePayinDto = {
      order_id: orderId,
      // Format price as a decimal string (e.g., "100.00")
      amount: orderData.price,
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
  };
}
