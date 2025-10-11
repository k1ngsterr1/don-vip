// Утилита для определения названия дизайнерской услуги по цене
// Используется для корректного отображения в чеках и заказах
// Интегрировано с API для получения актуальных цен

import {
  designServicesApi,
  DesignServicePublic,
} from "@/shared/api/design-services";

interface DesignServiceMapping {
  serviceKey: string;
  nameRu: string;
  nameEn: string;
  descriptionRu: string;
  descriptionEn: string;
}

// Кэш для хранения данных из API
let servicesCache: DesignServicePublic[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

const designServiceMappings: DesignServiceMapping[] = [
  {
    serviceKey: "miniEdit",
    nameRu: "Мини редактирование",
    nameEn: "Mini Edit",
    descriptionRu: "Мелкие правки дизайна (цвет, текст, размеры)",
    descriptionEn: "Small design edits (color, text, sizes)",
  },
  {
    serviceKey: "basicElement",
    nameRu: "Базовый элемент",
    nameEn: "Basic Element",
    descriptionRu: "Создание одной иконки, кнопки или простого баннера",
    descriptionEn: "Creating one icon, button or simple banner",
  },
  {
    serviceKey: "lightBanner",
    nameRu: "Лёгкий баннер",
    nameEn: "Light Banner",
    descriptionRu: "Дизайн простого баннера или карточки товара",
    descriptionEn: "Simple banner or product card design",
  },
  {
    serviceKey: "socialStart",
    nameRu: "Социальные сети старт",
    nameEn: "Social Start",
    descriptionRu: "Оформление поста/сторис для Instagram, Telegram или TikTok",
    descriptionEn: "Post/story design for Instagram, Telegram or TikTok",
  },
  {
    serviceKey: "logoLight",
    nameRu: "Логотип лайт",
    nameEn: "Logo Light",
    descriptionRu: "Простой логотип в 1-2 вариантах",
    descriptionEn: "Simple logo in 1-2 variants",
  },
  {
    serviceKey: "brandMini",
    nameRu: "Мини бренд",
    nameEn: "Brand Mini",
    descriptionRu: "Базовый набор: логотип + цветовая схема + шрифты",
    descriptionEn: "Basic set: logo + color scheme + fonts",
  },
  {
    serviceKey: "webDesignLight",
    nameRu: "Веб-дизайн лайт",
    nameEn: "Web Design Light",
    descriptionRu: "1–2 блока сайта (главная секция, карточка товара)",
    descriptionEn: "1–2 website blocks (main section, product card)",
  },
  {
    serviceKey: "businessBanner",
    nameRu: "Бизнес баннер",
    nameEn: "Business Banner",
    descriptionRu: "Пакет баннеров для сайта или рекламы (3–5 шт.)",
    descriptionEn: "Banner pack for website or advertising (3–5 pcs)",
  },
  {
    serviceKey: "socialPro",
    nameRu: "Социальные сети про",
    nameEn: "Social Pro",
    descriptionRu: "Комплект оформления: аватарка, баннер, 5 шаблонов постов",
    descriptionEn: "Design set: avatar, banner, 5 post templates",
  },
  {
    serviceKey: "logoPro",
    nameRu: "Логотип про",
    nameEn: "Logo Pro",
    descriptionRu: "Премиум-логотип в 3–4 вариантах + исходники",
    descriptionEn: "Premium logo in 3–4 variants + source files",
  },
  {
    serviceKey: "startupPack",
    nameRu: "Стартап пакет",
    nameEn: "Startup Pack",
    descriptionRu: "Логотип + фирменный стиль + баннер для запуска бизнеса",
    descriptionEn: "Logo + brand style + banner for business launch",
  },
  {
    serviceKey: "webDesignLight2",
    nameRu: "Веб-дизайн лайт 2",
    nameEn: "Web Design Light 2",
    descriptionRu: "Полный дизайн лендинга до 5 блоков",
    descriptionEn: "Full landing page design up to 5 blocks",
  },
  {
    serviceKey: "webDesignPro",
    nameRu: "Веб-дизайн про",
    nameEn: "Web Design Pro",
    descriptionRu: "Дизайн многостраничного сайта (до 10 страниц)",
    descriptionEn: "Multi-page website design (up to 10 pages)",
  },
  {
    serviceKey: "ecommerce",
    nameRu: "E-commerce",
    nameEn: "E-commerce",
    descriptionRu: "Полный UI/UX дизайн e-commerce платформы",
    descriptionEn: "Full UI/UX design for e-commerce platform",
  },
  {
    serviceKey: "brandingPremium",
    nameRu: "Брендинг премиум",
    nameEn: "Branding Premium",
    descriptionRu: "Фирменный стиль компании + брендбук + гайдлайны",
    descriptionEn: "Company brand style + brandbook + guidelines",
  },
  {
    serviceKey: "fullDesign",
    nameRu: "Полный дизайн",
    nameEn: "Full Design",
    descriptionRu:
      "Полный дизайн-пакет: сайт, соцсети, брендбук, маркетинговые материалы",
    descriptionEn:
      "Complete design package: website, social media, brandbook, marketing materials",
  },
];

// Функция для получения услуг из API с кэшированием
async function getDesignServices(): Promise<DesignServicePublic[]> {
  const now = Date.now();

  // Проверяем, есть ли валидный кэш
  if (
    servicesCache &&
    cacheTimestamp &&
    now - cacheTimestamp < CACHE_DURATION
  ) {
    return servicesCache;
  }

  try {
    // Получаем данные из API
    servicesCache = await designServicesApi.getAll();
    cacheTimestamp = now;
    return servicesCache;
  } catch (error) {
    console.warn("Failed to fetch design services from API:", error);
    // Если API недоступно, возвращаем пустой массив
    return [];
  }
}

// Функция для поиска услуги по цене в данных API
async function findServiceByPrice(
  priceRub: number
): Promise<DesignServicePublic | null> {
  const services = await getDesignServices();
  return services.find((service) => service.price === priceRub) || null;
}

/**
 * Определяет название дизайнерской услуги по цене в рублях
 * @param priceRub - Цена в рублях
 * @param locale - Локаль ('ru' или 'en')
 * @param fallbackName - Название по умолчанию, если услуга не найдена
 * @returns Название услуги или fallback
 */
export async function getDesignServiceNameByPrice(
  priceRub: number,
  locale: string = "ru",
  fallbackName?: string
): Promise<string> {
  // Сначала ищем в API
  const apiService = await findServiceByPrice(priceRub);
  if (apiService) {
    // Ищем локализованное название в маппинге
    const mapping = designServiceMappings.find(
      (m) => m.serviceKey === apiService.service_key
    );
    if (mapping) {
      return locale === "ru" ? mapping.nameRu : mapping.nameEn;
    }
    // Если маппинг не найден, возвращаем название из API
    return apiService.title;
  }

  return fallbackName || (locale === "ru" ? "Дизайн услуга" : "Design service");
}

/**
 * Синхронная версия функции для случаев, когда нет возможности использовать async
 * Использует только локальные маппинги по service_key
 */
export function getDesignServiceNameByKey(
  serviceKey: string,
  locale: string = "ru",
  fallbackName?: string
): string {
  const mapping = designServiceMappings.find(
    (m) => m.serviceKey === serviceKey
  );

  if (mapping) {
    return locale === "ru" ? mapping.nameRu : mapping.nameEn;
  }

  return fallbackName || (locale === "ru" ? "Дизайн услуга" : "Design service");
}

/**
 * Определяет описание дизайнерской услуги по цене в рублях
 * @param priceRub - Цена в рублях
 * @param locale - Локаль ('ru' или 'en')
 * @param fallbackDescription - Описание по умолчанию, если услуга не найдена
 * @returns Описание услуги или fallback
 */
export async function getDesignServiceDescriptionByPrice(
  priceRub: number,
  locale: string = "ru",
  fallbackDescription?: string
): Promise<string> {
  // Сначала ищем в API
  const apiService = await findServiceByPrice(priceRub);
  if (apiService) {
    // Ищем локализованное описание в маппинге
    const mapping = designServiceMappings.find(
      (m) => m.serviceKey === apiService.service_key
    );
    if (mapping) {
      return locale === "ru" ? mapping.descriptionRu : mapping.descriptionEn;
    }
    // Если маппинг не найден, возвращаем описание из API
    return apiService.description || apiService.title;
  }

  return (
    fallbackDescription ||
    (locale === "ru"
      ? "Профессиональная дизайн услуга"
      : "Professional design service")
  );
}

/**
 * Синхронная версия функции для случаев, когда нет возможности использовать async
 * Использует только локальные маппинги по service_key
 */
export function getDesignServiceDescriptionByKey(
  serviceKey: string,
  locale: string = "ru",
  fallbackDescription?: string
): string {
  const mapping = designServiceMappings.find(
    (m) => m.serviceKey === serviceKey
  );

  if (mapping) {
    return locale === "ru" ? mapping.descriptionRu : mapping.descriptionEn;
  }

  return (
    fallbackDescription ||
    (locale === "ru"
      ? "Профессиональная дизайн услуга"
      : "Professional design service")
  );
}

/**
 * Проверяет, является ли цена дизайнерской услугой
 * @param priceRub - Цена в рублях
 * @returns true, если это цена дизайнерской услуги
 */
export async function isDesignServicePrice(priceRub: number): Promise<boolean> {
  const apiService = await findServiceByPrice(priceRub);
  return apiService !== null;
}

/**
 * Синхронная версия - проверяет по service_key
 */
export function isDesignServiceKey(serviceKey: string): boolean {
  return designServiceMappings.some(
    (mapping) => mapping.serviceKey === serviceKey
  );
}

/**
 * Получает полную информацию о дизайнерской услуге по цене
 * @param priceRub - Цена в рублях
 * @returns Информация об услуге или null
 */
export async function getDesignServiceByPrice(
  priceRub: number
): Promise<{ service: any; mapping: DesignServiceMapping } | null> {
  const apiService = await findServiceByPrice(priceRub);
  if (apiService) {
    const mapping = designServiceMappings.find(
      (m) => m.serviceKey === apiService.service_key
    );
    if (mapping) {
      return { service: apiService, mapping };
    }
  }
  return null;
}

/**
 * Синхронная версия - получает маппинг по service_key
 */
export function getDesignServiceByKey(
  serviceKey: string
): DesignServiceMapping | null {
  return (
    designServiceMappings.find(
      (mapping) => mapping.serviceKey === serviceKey
    ) || null
  );
}
