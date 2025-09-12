import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../api/order.api";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export const useRepeatOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: (orderId: string | number) => orderApi.repeatOrder(orderId),
    onSuccess: (newOrder) => {
      // Invalidate purchase history to refresh the list
      queryClient.invalidateQueries({ queryKey: ["purchaseHistory"] });

      // Redirect to the order page or payment page based on the new order
      // You can customize this based on your app's flow
      if (newOrder.id) {
        // If the order was successfully created, redirect to payment
        router.push(`/${locale}/payment?orderId=${newOrder.id}`);
      }
    },
    onError: (error: Error) => {
      console.error("Failed to repeat order:", error);
      // You can add toast notification here
    },
  });
};
