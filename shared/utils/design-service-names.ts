// Утилита для определения названия дизайнерской услуги по цене
// Используется для корректного отображения в чеках и заказах

interface DesignServiceMapping {
  price: number;
  nameRu: string;
  nameEn: string;
  descriptionRu: string;
  descriptionEn: string;
}

const designServiceMappings: DesignServiceMapping[] = [
  {
    price: 40,
    nameRu: "Мини-правка",
    nameEn: "Mini Edit",
    descriptionRu: "Мелкие правки дизайна (цвет, текст, размеры)",
    descriptionEn: "Small design edits (color, text, sizes)",
  },
  {
    price: 170,
    nameRu: "Базовый элемент",
    nameEn: "Basic Element",
    descriptionRu: "Создание одной иконки, кнопки или простого баннера",
    descriptionEn: "Creating one icon, button or simple banner",
  },
  {
    price: 340,
    nameRu: "Лёгкий баннер",
    nameEn: "Light Banner",
    descriptionRu: "Дизайн простого баннера или карточки товара",
    descriptionEn: "Simple banner or product card design",
  },
  {
    price: 510,
    nameRu: "Соцсети старт",
    nameEn: "Social Start",
    descriptionRu: "Оформление поста/сторис для Instagram, Telegram или TikTok",
    descriptionEn: "Post/story design for Instagram, Telegram or TikTok",
  },
  {
    price: 850,
    nameRu: "Логотип Лайт",
    nameEn: "Logo Light",
    descriptionRu: "Простой логотип в 1-2 вариантах",
    descriptionEn: "Simple logo in 1-2 variants",
  },
  {
    price: 1700,
    nameRu: "Фирменный стиль Мини",
    nameEn: "Brand Style Mini",
    descriptionRu: "Базовый набор: логотип + цветовая схема + шрифты",
    descriptionEn: "Basic set: logo + color scheme + fonts",
  },
  {
    price: 2550,
    nameRu: "Дизайн для сайта Лайт",
    nameEn: "Website Design Light",
    descriptionRu: "1–2 блока сайта (главная секция, карточка товара)",
    descriptionEn: "1–2 website blocks (main section, product card)",
  },
  {
    price: 3400,
    nameRu: "Бизнес-баннер",
    nameEn: "Business Banner",
    descriptionRu: "Пакет баннеров для сайта или рекламы (3–5 шт.)",
    descriptionEn: "Banner pack for website or advertising (3–5 pcs)",
  },
  {
    price: 5100,
    nameRu: "Соцсети PRO",
    nameEn: "Social PRO",
    descriptionRu: "Комплект оформления: аватарка, баннер, 5 шаблонов постов",
    descriptionEn: "Design set: avatar, banner, 5 post templates",
  },
  {
    price: 6800,
    nameRu: "Логотип PRO",
    nameEn: "Logo PRO",
    descriptionRu: "Премиум-логотип в 3–4 вариантах + исходники",
    descriptionEn: "Premium logo in 3–4 variants + source files",
  },
  {
    price: 8500,
    nameRu: "Дизайн-пакет «Стартап»",
    nameEn: "Startup Design Pack",
    descriptionRu: "Логотип + фирменный стиль + баннер для запуска бизнеса",
    descriptionEn: "Logo + brand style + banner for business launch",
  },
  {
    price: 17000,
    nameRu: "Дизайн сайта Лайт",
    nameEn: "Website Design Light",
    descriptionRu: "Полный дизайн лендинга до 5 блоков",
    descriptionEn: "Full landing page design up to 5 blocks",
  },
  {
    price: 25500,
    nameRu: "Дизайн сайта PRO",
    nameEn: "Website Design PRO",
    descriptionRu: "Дизайн многостраничного сайта (до 10 страниц)",
    descriptionEn: "Multi-page website design (up to 10 pages)",
  },
  {
    price: 34000,
    nameRu: "Дизайн интернет-магазина",
    nameEn: "E-commerce Design",
    descriptionRu: "Полный UI/UX дизайн e-commerce платформы",
    descriptionEn: "Full UI/UX design for e-commerce platform",
  },
  {
    price: 42500,
    nameRu: "Брендинг Premium",
    nameEn: "Branding Premium",
    descriptionRu: "Фирменный стиль компании + брендбук + гайдлайны",
    descriptionEn: "Company brand style + brandbook + guidelines",
  },
  {
    price: 51000,
    nameRu: "Дизайн под ключ",
    nameEn: "Full Design Package",
    descriptionRu:
      "Полный дизайн-пакет: сайт, соцсети, брендбук, маркетинговые материалы",
    descriptionEn:
      "Complete design package: website, social media, brandbook, marketing materials",
  },
];

/**
 * Определяет название дизайнерской услуги по цене в рублях
 * @param priceRub - Цена в рублях
 * @param locale - Локаль ('ru' или 'en')
 * @param fallbackName - Название по умолчанию, если услуга не найдена
 * @returns Название услуги или fallback
 */
export function getDesignServiceNameByPrice(
  priceRub: number,
  locale: string = "ru",
  fallbackName?: string
): string {
  const service = designServiceMappings.find(
    (mapping) => mapping.price === priceRub
  );

  if (service) {
    return locale === "ru" ? service.nameRu : service.nameEn;
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
export function getDesignServiceDescriptionByPrice(
  priceRub: number,
  locale: string = "ru",
  fallbackDescription?: string
): string {
  const service = designServiceMappings.find(
    (mapping) => mapping.price === priceRub
  );

  if (service) {
    return locale === "ru" ? service.descriptionRu : service.descriptionEn;
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
export function isDesignServicePrice(priceRub: number): boolean {
  return designServiceMappings.some((mapping) => mapping.price === priceRub);
}

/**
 * Получает полную информацию о дизайнерской услуге по цене
 * @param priceRub - Цена в рублях
 * @returns Информация об услуге или null
 */
export function getDesignServiceByPrice(
  priceRub: number
): DesignServiceMapping | null {
  return (
    designServiceMappings.find((mapping) => mapping.price === priceRub) || null
  );
}
