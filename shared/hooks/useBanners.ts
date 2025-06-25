import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiClient } from "../config/apiClient";

export interface BannerApi {
  image: string;
  mobileImage: string;
  buttonLink: string;
}

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data } = await apiClient.get<BannerApi[]>("/banners");

      // Проверяем что данные существуют и это массив
      if (!data || !Array.isArray(data) || data.length === 0) {
        return [];
      }

      return data.map((item, idx) => ({
        id: idx,
        image: {
          desktop: item.image,
          mobile: item.mobileImage,
        },
        link: item.buttonLink,
      }));
    },
    // Добавляем fallback для пустого массива
    select: (data) => data || [],
  });
}
