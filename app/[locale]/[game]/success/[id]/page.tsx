//@ts-nocheck

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Order } from "@/entities/order/model/types";
import { useTranslations } from "next-intl";
import { CheckCircle } from "lucide-react";
import { orderApi } from "@/entities/order/api/order.api";

export default function OrderSuccessPage() {
  const t = useTranslations("orderSuccess");
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = params.id as string;
        const orderData = await orderApi.getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError(t("errors.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">{t("errors.title")}</h1>
          <p>{error || t("errors.generic")}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue text-white rounded-lg"
          >
            {t("backToHome")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
          <p className="text-gray-600 mt-2">{t("description")}</p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium mb-4">{t("orderDetails")}</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("orderId")}:</span>
              <span className="font-medium">#{order.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t("type")}:</span>
              <span className="font-medium">{order.type}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t("amount")}:</span>
              <span className="font-medium">{order.amount}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t("price")}:</span>
              <span className="font-medium">${order.price}</span>
            </div>

            {order.account_id && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t("accountId")}:</span>
                <span className="font-medium">{order.account_id}</span>
              </div>
            )}

            {order.server_id && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t("serverId")}:</span>
                <span className="font-medium">{order.server_id}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">{t("status")}:</span>
              <span className="font-medium text-green-600">
                {t(`statuses.${order.status}`)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t("date")}:</span>
              <span className="font-medium">
                {new Date(order.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col space-y-3">
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-blue text-white rounded-lg font-medium"
          >
            {t("backToHome")}
          </button>

          <button
            onClick={() => router.push("/orders")}
            className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium"
          >
            {t("viewAllOrders")}
          </button>
        </div>
      </div>
    </div>
  );
}
