"use client";

import { useQuery } from "@tanstack/react-query";
import {
  designServicesApi,
  type DesignServicePublic,
} from "@/shared/api/design-services";

export const useDesignServices = () => {
  return useQuery({
    queryKey: ["design-services"],
    queryFn: () => designServicesApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const useDesignServiceByKey = (serviceKey: string) => {
  return useQuery({
    queryKey: ["design-service", serviceKey],
    queryFn: () => designServicesApi.getByKey(serviceKey),
    enabled: !!serviceKey,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const useDesignServicesPrices = () => {
  return useQuery({
    queryKey: ["design-services-prices"],
    queryFn: () => designServicesApi.getPrices(),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
