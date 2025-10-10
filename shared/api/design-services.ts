import { apiClient } from "@/shared/config/apiClient";

export interface DesignServicePublic {
  id: number;
  service_key: string;
  title: string;
  description?: string;
  price: number;
  is_active: boolean;
  sort_order: number;
}

export const designServicesApi = {
  // Получить все активные услуги (публичный эндпоинт)
  getAll: async (): Promise<DesignServicePublic[]> => {
    const response = await apiClient.get("/design-services");
    return response.data;
  },

  // Получить услугу по ключу
  getByKey: async (serviceKey: string): Promise<DesignServicePublic> => {
    const response = await apiClient.get(`/design-services/key/${serviceKey}`);
    return response.data;
  },

  // Получить цены в виде объекта {service_key: price}
  getPrices: async (): Promise<Record<string, number>> => {
    const services = await designServicesApi.getAll();
    const prices: Record<string, number> = {};

    services.forEach((service) => {
      prices[service.service_key] = service.price;
    });

    return prices;
  },
};
