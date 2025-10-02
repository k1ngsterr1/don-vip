"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import {
  Palette,
  PenTool,
  Layout,
  Globe,
  Smartphone,
  Zap,
  Users,
  Star,
} from "lucide-react";
interface DesignService {
  id: number;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  price: number; // цена в рублях
  features: string[];
  popular?: boolean;
  delivery: string; // срок выполнения
}

const designServices: DesignService[] = [
  {
    id: 1,
    titleKey: "logoDesign",
    descriptionKey: "logoDesignDesc",
    icon: <PenTool className="w-8 h-8" />,
    price: 1500,
    features: [
      "5 концептов",
      "3 правки",
      "Векторные файлы",
      "Гайд по использованию",
    ],
    delivery: "3-5 дней",
    popular: true,
  },
  {
    id: 2,
    titleKey: "brandingPackage",
    descriptionKey: "brandingPackageDesc",
    icon: <Palette className="w-8 h-8" />,
    price: 3000,
    features: [
      "Логотип",
      "Фирменный стиль",
      "Цветовая палитра",
      "Шрифты",
      "Визитки",
      "Презентация",
    ],
    delivery: "7-10 дней",
  },
  {
    id: 3,
    titleKey: "websiteDesign",
    descriptionKey: "websiteDesignDesc",
    icon: <Globe className="w-8 h-8" />,
    price: 2500,
    features: [
      "До 5 страниц",
      "Адаптивный дизайн",
      "UI/UX проектирование",
      "Интерактивный прототип",
    ],
    delivery: "10-14 дней",
  },
  {
    id: 4,
    titleKey: "mobileAppDesign",
    descriptionKey: "mobileAppDesignDesc",
    icon: <Smartphone className="w-8 h-8" />,
    price: 2800,
    features: [
      "До 10 экранов",
      "iOS/Android",
      "Интерактивный прототип",
      "UI Kit",
      "Иконки",
    ],
    delivery: "14-21 день",
  },
  {
    id: 5,
    titleKey: "uiuxDesign",
    descriptionKey: "uiuxDesignDesc",
    icon: <Layout className="w-8 h-8" />,
    price: 2200,
    features: [
      "Пользовательские сценарии",
      "Wireframes",
      "UI дизайн",
      "Интерактивный прототип",
    ],
    delivery: "7-12 дней",
  },
  {
    id: 6,
    titleKey: "socialMediaDesign",
    descriptionKey: "socialMediaDesignDesc",
    icon: <Users className="w-8 h-8" />,
    price: 800,
    features: [
      "10 постов",
      "Обложки",
      "Stories шаблоны",
      "Аватарки",
      "Исходники",
    ],
    delivery: "3-7 дней",
  },
  {
    id: 7,
    titleKey: "printDesign",
    descriptionKey: "printDesignDesc",
    icon: <Star className="w-8 h-8" />,
    price: 600,
    features: [
      "Флаеры",
      "Буклеты",
      "Баннеры",
      "Визитки",
      "Подготовка к печати",
    ],
    delivery: "2-5 дней",
  },
  {
    id: 8,
    titleKey: "motionGraphics",
    descriptionKey: "motionGraphicsDesc",
    icon: <Zap className="w-8 h-8" />,
    price: 1200,
    features: [
      "Анимированный логотип",
      "Промо видео",
      "Интро/Outro",
      "До 30 сек",
      "Full HD",
    ],
    delivery: "5-10 дней",
  },
];

export const DesignServices = () => {
  const locale = useLocale();
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Простой форматтер цен в рублях
  const formatPrice = (priceInRub: number) => {
    return `${priceInRub.toLocaleString()} ₽`;
  };

  // Хардкодные переводы
  const translations = {
    ru: {
      title: "Дизайн Услуги",
      subtitle:
        "Профессиональные дизайн-услуги для вашего бизнеса. Создаем уникальные решения, которые выделят вас среди конкурентов.",
      popular: "Популярно",
      project: "проект",
      delivery: "Срок выполнения",
      orderButton: "Заказать",
      contactTitle: "Нужна индивидуальная консультация?",
      contactDescription:
        "Свяжитесь с нами для обсуждения вашего проекта. Мы предложим лучшее решение под ваши задачи и бюджет.",
      contactButton: "Связаться с нами",
      portfolioButton: "Посмотреть портфолио",
      logoDesign: "Дизайн Логотипа",
      logoDesignDesc:
        "Создание уникального и запоминающегося логотипа для вашего бренда. Несколько концептов на выбор.",
      brandingPackage: "Фирменный Стиль",
      brandingPackageDesc:
        "Полный пакет фирменного стиля: логотип, цвета, шрифты, визитки и презентация бренда.",
      websiteDesign: "Дизайн Сайта",
      websiteDesignDesc:
        "Современный адаптивный дизайн сайта с учетом UX/UI принципов и трендов веб-дизайна.",
      mobileAppDesign: "Дизайн Мобильного Приложения",
      mobileAppDesignDesc:
        "Дизайн интерфейса мобильного приложения для iOS и Android с интерактивными прототипами.",
      uiuxDesign: "UI/UX Дизайн",
      uiuxDesignDesc:
        "Проектирование пользовательского опыта и интерфейса с фокусом на удобство использования.",
      socialMediaDesign: "Дизайн для Соцсетей",
      socialMediaDesignDesc:
        "Креативные посты, обложки и Stories для ваших социальных сетей. Все в едином стиле.",
      printDesign: "Печатный Дизайн",
      printDesignDesc:
        "Дизайн полиграфической продукции: флаеры, буклеты, баннеры с подготовкой к печати.",
      motionGraphics: "Моушн Графика",
      motionGraphicsDesc:
        "Анимированные логотипы, промо-видео и интро для вашего бренда в высоком качестве.",
    },
    en: {
      title: "Design Services",
      subtitle:
        "Professional design services for your business. We create unique solutions that will make you stand out from the competition.",
      popular: "Popular",
      project: "project",
      delivery: "Delivery time",
      orderButton: "Order Now",
      contactTitle: "Need a custom consultation?",
      contactDescription:
        "Contact us to discuss your project. We'll offer the best solution for your needs and budget.",
      contactButton: "Contact Us",
      portfolioButton: "View Portfolio",
      logoDesign: "Logo Design",
      logoDesignDesc:
        "Creating a unique and memorable logo for your brand. Multiple concepts to choose from.",
      brandingPackage: "Brand Identity Package",
      brandingPackageDesc:
        "Complete brand identity package: logo, colors, fonts, business cards and brand presentation.",
      websiteDesign: "Website Design",
      websiteDesignDesc:
        "Modern responsive website design following UX/UI principles and current web design trends.",
      mobileAppDesign: "Mobile App Design",
      mobileAppDesignDesc:
        "Mobile app interface design for iOS and Android with interactive prototypes.",
      uiuxDesign: "UI/UX Design",
      uiuxDesignDesc:
        "User experience and interface design with focus on usability and user satisfaction.",
      socialMediaDesign: "Social Media Design",
      socialMediaDesignDesc:
        "Creative posts, covers and Stories for your social media. Everything in a unified style.",
      printDesign: "Print Design",
      printDesignDesc:
        "Printing materials design: flyers, brochures, banners with print-ready preparation.",
      motionGraphics: "Motion Graphics",
      motionGraphicsDesc:
        "Animated logos, promo videos and intros for your brand in high quality.",
    },
  };

  const t =
    translations[locale as keyof typeof translations] || translations.ru;

  const handleServiceSelect = (serviceId: number) => {
    setSelectedService(serviceId);
    // Здесь можно добавить логику для перехода к заказу
    console.log("Selected service:", serviceId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t.title}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {designServices.map((service) => (
          <div
            key={service.id}
            className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border ${
              service.popular
                ? "border-blue-200 ring-2 ring-blue-100"
                : "border-gray-200"
            }`}
          >
            {/* Popular Badge */}
            {service.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {t.popular}
                </span>
              </div>
            )}

            <div className="p-6">
              {/* Icon and Title */}
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  {service.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t[service.titleKey as keyof typeof t]}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p
                className="text-gray-600 text-sm mb-4 overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {t[service.descriptionKey as keyof typeof t]}
              </p>

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(service.price)}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  / {t.project}
                </span>
              </div>

              {/* Delivery Time */}
              <div className="mb-4 text-sm text-gray-600">
                <span className="font-medium">{t.delivery}:</span>{" "}
                {service.delivery}
              </div>

              {/* Features */}
              <div className="mb-6">
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Button */}
              <button
                onClick={() => handleServiceSelect(service.id)}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
                  service.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                {t.orderButton}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Information */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t.contactTitle}
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          {t.contactDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors">
            {t.contactButton}
          </button>
          <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-xl font-medium transition-colors">
            {t.portfolioButton}
          </button>
        </div>
      </div>
    </div>
  );
};
