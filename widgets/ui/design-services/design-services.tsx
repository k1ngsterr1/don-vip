"use client";

import { useLocale } from "next-intl";
import {
  Star,
  Check,
  Edit3,
  Palette,
  Image,
  CreditCard,
  FileText,
  Lightbulb,
  User,
  Monitor,
} from "lucide-react";

interface ServiceItem {
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  price: number;
  features: string[];
  features_en: string[];
  icon: React.ElementType;
  popular?: boolean;
}

const designServices: ServiceItem[] = [
  {
    title: "Мини-правка",
    title_en: "Mini Edit",
    description: "Мелкая корректировка макета",
    description_en: "Small layout correction",
    price: 40,
    icon: Edit3,
    features: ["Мелкая корректировка макета"],
    features_en: ["Small layout correction"],
  },
  {
    title: "Иконка",
    title_en: "Icon",
    description: "1 уникальная иконка в векторе",
    description_en: "1 unique vector icon",
    price: 167,
    icon: Palette,
    features: ["1 уникальная иконка в векторе"],
    features_en: ["1 unique vector icon"],
  },
  {
    title: "Сторис-баннер",
    title_en: "Stories Banner",
    description: "Дизайн 1 баннера для соцсетей",
    description_en: "Design 1 banner for social networks",
    price: 335,
    icon: Image,
    features: ["Дизайн 1 баннера для соцсетей"],
    features_en: ["Design 1 banner for social networks"],
  },
  {
    title: "Визитка",
    title_en: "Business Card",
    description: "Макет 1 визитки (две стороны)",
    description_en: "Business card layout (two sides)",
    price: 505,
    icon: CreditCard,
    features: ["Макет 1 визитки (две стороны)"],
    features_en: ["Business card layout (two sides)"],
  },
  {
    title: "Флаер",
    title_en: "Flyer",
    description: "Дизайн флаера А5",
    description_en: "A5 flyer design",
    price: 840,
    icon: FileText,
    features: ["Дизайн флаера А5"],
    features_en: ["A5 flyer design"],
  },
  {
    title: "Логотип базовый",
    title_en: "Basic Logo",
    description: "1 концепция логотипа",
    description_en: "1 logo concept",
    price: 1670,
    icon: Lightbulb,
    features: ["1 концепция логотипа", "2 итерации правок"],
    features_en: ["1 logo concept", "2 revision iterations"],
    popular: true,
  },
  {
    title: "Аватар + обложка",
    title_en: "Avatar + Cover",
    description: "Аватар и обложка для соцсетей",
    description_en: "Avatar and cover for social networks",
    price: 2510,
    icon: User,
    features: ["Аватар и обложка для соцсетей"],
    features_en: ["Avatar and cover for social networks"],
  },
  {
    title: "Презентация мини",
    title_en: "Mini Presentation",
    description: "5 слайдов презентации",
    description_en: "5 presentation slides",
    price: 3350,
    icon: Monitor,
    features: ["5 слайдов презентации"],
    features_en: ["5 presentation slides"],
  },
];

export function DesignServices() {
  const locale = useLocale();

  const getLocalizedText = (text: string, textEn: string): string => {
    return locale === "en" ? textEn : text;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {locale === "en"
            ? "Design Services with Fixed Prices"
            : "Дизайн-услуги с фиксированными ценами"}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {locale === "en"
            ? "Choose the right service and place your order online."
            : "Выберите подходящую услугу и оформите заказ онлайн."}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {designServices.map((service, index) => (
          <div
            key={index}
            className={`group relative bg-white rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 ${
              service.popular
                ? "ring-2 ring-blue-500 ring-opacity-50 shadow-lg"
                : ""
            }`}
          >
            {/* Popular Badge */}
            {service.popular && (
              <div className="absolute -top-3 left-6">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {locale === "en" ? "Popular" : "Популярное"}
                </div>
              </div>
            )}

            {/* Service Header */}
            <div className="mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors duration-300">
                <service.icon className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {getLocalizedText(service.title, service.title_en)}
              </h3>
              <p className="text-sm text-gray-600">
                {getLocalizedText(service.description, service.description_en)}
              </p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {service.price} ₽
              </span>
            </div>

            {/* Features */}
            <div className="mb-6 space-y-2">
              {service.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    {locale === "en"
                      ? service.features_en[featureIndex]
                      : feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Button */}
            <button
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                service.popular
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {locale === "en" ? "Order" : "Заказать"}
            </button>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          {locale === "en"
            ? "All prices are fixed. Quality guarantee and fast execution."
            : "Все цены фиксированы. Гарантия качества и быстрое выполнение."}
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            {locale === "en" ? "Quality guarantee" : "Гарантия качества"}
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            {locale === "en" ? "Fast execution" : "Быстрое выполнение"}
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            {locale === "en"
              ? "Professional approach"
              : "Профессиональный подход"}
          </div>
        </div>
      </div>
    </div>
  );
}
