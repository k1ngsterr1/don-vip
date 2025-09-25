import { useQuery } from "@tanstack/react-query";
import { productService } from "../../api/product.api";
import { useLocale } from "next-intl";
import type { Product } from "../../model/types";

// Хардкодные данные для услуги "Иконка"
const getIconServiceData = (locale: string): Product => ({
  id: 9999,
  name: locale === "ru" ? "Иконка" : "Icon Design",
  description:
    locale === "ru"
      ? "Профессиональная разработка иконки для вашего бренда или проекта"
      : "Professional icon design for your brand or project",
  description_en: "Professional icon design for your brand or project",
  image: "/feature-card.webp",
  currency_name: locale === "ru" ? "Услуга" : "Service",
  currency_image: "icon:paintbrush", // Специальное значение для иконки
  isServerRequired: false,
  type: "Smile" as const,
  replenishment: [
    {
      price: 100,
      amount: 1,
      type: "service",
      sku: "icon-service-standard",
    },
  ],
  // Required fields для покупки - все false для услуги иконки
  requireUserId: false,
  requireServer: false,
  requireEmail: true, // email нужен для связи с клиентом
  requireUID: false,
  // Поля для API
  smile_api_game: undefined,
  donatbank_product_id: undefined,
  // Временные метки
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Хардкодные данные для услуги "Генерация иконок"
const getIconGenerationServiceData = (locale: string): Product => ({
  id: 9998,
  name: locale === "ru" ? "Генерация иконок" : "Icon Generation",
  description:
    locale === "ru"
      ? "Автоматическая генерация иконок с помощью ИИ для вашего проекта"
      : "Automatic AI-powered icon generation for your project",
  description_en: "Automatic AI-powered icon generation for your project",
  image: "/feature-card.webp",
  currency_name: locale === "ru" ? "Услуга" : "Service",
  currency_image: "icon:cpu", // Специальное значение для иконки ИИ
  isServerRequired: false,
  type: "Smile" as const,
  replenishment: [
    {
      price: 50,
      amount: 1,
      type: "service",
      sku: "icon-generation-basic",
    },
    {
      price: 150,
      amount: 5,
      type: "service",
      sku: "icon-generation-pack",
    },
    {
      price: 250,
      amount: 10,
      type: "service",
      sku: "icon-generation-pro",
    },
  ],
  // Required fields для покупки - все false для услуги генерации иконок
  requireUserId: false,
  requireServer: false,
  requireEmail: true, // email нужен для связи с клиентом
  requireUID: false,
  // Поля для API
  smile_api_game: undefined,
  donatbank_product_id: undefined,
  // Временные метки
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const useProductWithHardcoded = (id: number) => {
  const locale = useLocale();

  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      // Если ID = 9999, возвращаем хардкодные данные для дизайна иконки
      if (id === 9999) {
        return getIconServiceData(locale);
      }
      // Если ID = 9998, возвращаем хардкодные данные для генерации иконок
      if (id === 9998) {
        return getIconGenerationServiceData(locale);
      }
      // Иначе используем обычный API
      return productService.findOne(id);
    },
    enabled: !!id,
  });
};
