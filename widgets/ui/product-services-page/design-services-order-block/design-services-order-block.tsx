"use client";

import { PaymentMethodSelector } from "@/entities/payment/ui/payment-method-selector";
import { cn } from "@/shared/utils/cn";
import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import {
  Palette,
  PenTool,
  Layout,
  Globe,
  Smartphone,
  Zap,
  Users,
  Star,
  Check,
} from "lucide-react";
import { Banner } from "@/widgets/ui/order-page/banner/banner";
import { OrderSummary } from "@/widgets/ui/order-page/order-summary/order-summary";
import { UserIdForm } from "@/widgets/ui/order-page/user-id-form/user-id-form";
import { useCreateOrder } from "@/entities/order/hooks/use-create-order";
import type { CreateOrderDto } from "@/entities/order/model/types";
import { OrderBlockSkeleton } from "@/widgets/ui/order-page/loading/skeleton-loading";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useGetMe } from "@/entities/auth/hooks/use-auth";
import { GuestAuthPopup } from "@/entities/order/ui/guest-user-popup";
import { ReviewsSection } from "@/widgets/ui/order-page/reviews-section/reviews-section";
import { FAQSection } from "@/widgets/ui/order-page/faq-section/faq-section";
import {
  InstructionTabs,
  InstructionContent,
} from "@/widgets/ui/order-page/instruction-section/instruction-section";
import { GameDescription } from "@/widgets/ui/order-page/game-description/game-description";
import { GameInfoBlock } from "@/widgets/ui/order-page/game-info-block/game-info-block";
import { CustomAmountSelector } from "@/widgets/ui/order-page/custom-amount-selector/custom-amount-selector";
import {
  getDesignServiceNameByPrice,
  isDesignServicePrice,
} from "@/shared/utils/design-service-names";

interface DesignService {
  id: number;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  price: number;
  features: string[];
  popular?: boolean;
  delivery: string;
}

interface ServiceData {
  id: number;
  name: string;
  description: string;
  image: string;
  currencyName: string;
}

const designServices: DesignService[] = [
  {
    id: 1,
    titleKey: "miniEdit",
    descriptionKey: "miniEditDesc",
    icon: <PenTool className="w-8 h-8" />,
    price: 40,
    features: [
      "Изменение цвета",
      "Редактирование текста",
      "Корректировка размеров",
    ],
    delivery: "1 день",
  },
  {
    id: 2,
    titleKey: "basicElement",
    descriptionKey: "basicElementDesc",
    icon: <Star className="w-8 h-8" />,
    price: 170,
    features: ["Одна иконка", "Кнопка", "Простой баннер"],
    delivery: "1-2 дня",
  },
  {
    id: 3,
    titleKey: "lightBanner",
    descriptionKey: "lightBannerDesc",
    icon: <Layout className="w-8 h-8" />,
    price: 340,
    features: ["Простой баннер", "Карточка товара", "Готовый дизайн"],
    delivery: "2-3 дня",
  },
  {
    id: 4,
    titleKey: "socialStart",
    descriptionKey: "socialStartDesc",
    icon: <Users className="w-8 h-8" />,
    price: 510,
    features: [
      "Пост для Instagram",
      "Сторис для Telegram",
      "Контент для TikTok",
    ],
    delivery: "2-3 дня",
  },
  {
    id: 5,
    titleKey: "logoLight",
    descriptionKey: "logoLightDesc",
    icon: <Palette className="w-8 h-8" />,
    price: 850,
    features: ["1-2 варианта логотипа", "Векторные файлы", "Базовые правки"],
    delivery: "3-5 дней",
    popular: true,
  },
  {
    id: 6,
    titleKey: "brandMini",
    descriptionKey: "brandMiniDesc",
    icon: <Star className="w-8 h-8" />,
    price: 1700,
    features: ["Логотип", "Цветовая схема", "Шрифты", "Базовый набор"],
    delivery: "5-7 дней",
  },
  {
    id: 7,
    titleKey: "webDesignLight",
    descriptionKey: "webDesignLightDesc",
    icon: <Globe className="w-8 h-8" />,
    price: 2550,
    features: ["1-2 блока сайта", "Главная секция", "Карточка товара"],
    delivery: "7-10 дней",
  },
  {
    id: 8,
    titleKey: "businessBanner",
    descriptionKey: "businessBannerDesc",
    icon: <Layout className="w-8 h-8" />,
    price: 3400,
    features: ["3-5 баннеров", "Для сайта и рекламы", "Готовый пакет"],
    delivery: "7-10 дней",
  },
  {
    id: 9,
    titleKey: "socialPro",
    descriptionKey: "socialProDesc",
    icon: <Users className="w-8 h-8" />,
    price: 5100,
    features: [
      "Аватарка",
      "Баннер",
      "5 шаблонов постов",
      "Комплект оформления",
    ],
    delivery: "10-14 дней",
  },
  {
    id: 10,
    titleKey: "logoPro",
    descriptionKey: "logoProDesc",
    icon: <Palette className="w-8 h-8" />,
    price: 6800,
    features: ["3-4 варианта логотипа", "Исходники", "Премиум качество"],
    delivery: "7-14 дней",
  },
  {
    id: 11,
    titleKey: "startupPack",
    descriptionKey: "startupPackDesc",
    icon: <Zap className="w-8 h-8" />,
    price: 8500,
    features: [
      "Логотип",
      "Фирменный стиль",
      "Баннер для запуска",
      "Полный комплект",
    ],
    delivery: "14-21 день",
  },
  {
    id: 12,
    titleKey: "webDesignLight2",
    descriptionKey: "webDesignLight2Desc",
    icon: <Globe className="w-8 h-8" />,
    price: 17000,
    features: ["Полный дизайн лендинга", "До 5 блоков", "Адаптивный дизайн"],
    delivery: "21-30 дней",
  },
  {
    id: 13,
    titleKey: "webDesignPro",
    descriptionKey: "webDesignProDesc",
    icon: <Globe className="w-8 h-8" />,
    price: 25500,
    features: ["Многостраничный сайт", "До 10 страниц", "Полный UI/UX"],
    delivery: "30-45 дней",
  },
  {
    id: 14,
    titleKey: "ecommerce",
    descriptionKey: "ecommerceDesc",
    icon: <Smartphone className="w-8 h-8" />,
    price: 34000,
    features: [
      "Дизайн интернет-магазина",
      "UI/UX дизайн",
      "E-commerce платформа",
    ],
    delivery: "45-60 дней",
  },
  {
    id: 15,
    titleKey: "brandingPremium",
    descriptionKey: "brandingPremiumDesc",
    icon: <Star className="w-8 h-8" />,
    price: 42500,
    features: [
      "Фирменный стиль компании",
      "Брендбук",
      "Гайдлайны",
      "Премиум качество",
    ],
    delivery: "60-90 дней",
  },
  {
    id: 16,
    titleKey: "fullDesign",
    descriptionKey: "fullDesignDesc",
    icon: <Zap className="w-8 h-8" />,
    price: 51000,
    features: [
      "Дизайн сайта",
      "Соцсети",
      "Брендбук",
      "Маркетинговые материалы",
      "Полный пакет",
    ],
    delivery: "90-120 дней",
  },
];

export function DesignServicesOrderBlock() {
  const locale = useLocale();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [isCustomAmountSelected, setIsCustomAmountSelected] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [showGuestAuthPopup, setShowGuestAuthPopup] = useState(false);
  const [guestIdentifier, setGuestIdentifier] = useState("");
  const [activeTab, setActiveTab] = useState<
    "instruction" | "reviews" | "description" | "faq"
  >("instruction");
  const [error, setError] = useState("");

  // Хардкодные переводы
  const translations = {
    ru: {
      title: "Дизайн Услуги",
      subtitle: "Профессиональные дизайн-услуги для вашего бизнеса",
      selectService: "1. Выберите услугу",
      enterDetails: "2. Введите ваши данные",
      selectPayment: "3. Выберите способ оплаты",
      popular: "Популярно",
      from: "от",
      rub: "₽",
      delivery: "Срок выполнения",
      features: "Что входит",
      orderButton: "Заказать",
      emailLabel: "Email *",
      nameLabel: "Имя *",
      emailPlaceholder: "your@email.com",
      namePlaceholder: "Ваше имя",
      miniEdit: "Мини-правка",
      miniEditDesc: "Мелкие правки дизайна (цвет, текст, размеры)",
      basicElement: "Базовый элемент",
      basicElementDesc: "Создание одной иконки, кнопки или простого баннера",
      lightBanner: "Лёгкий баннер",
      lightBannerDesc: "Дизайн простого баннера или карточки товара",
      socialStart: "Соцсети старт",
      socialStartDesc:
        "Оформление поста/сторис для Instagram, Telegram или TikTok",
      logoLight: "Логотип Лайт",
      logoLightDesc: "Простой логотип в 1-2 вариантах",
      brandMini: "Фирменный стиль Мини",
      brandMiniDesc: "Базовый набор: логотип + цветовая схема + шрифты",
      webDesignLight: "Дизайн для сайта Лайт",
      webDesignLightDesc: "1–2 блока сайта (главная секция, карточка товара)",
      businessBanner: "Бизнес-баннер",
      businessBannerDesc: "Пакет баннеров для сайта или рекламы (3–5 шт.)",
      socialPro: "Соцсети PRO",
      socialProDesc: "Комплект оформления: аватарка, баннер, 5 шаблонов постов",
      logoPro: "Логотип PRO",
      logoProDesc: "Премиум-логотип в 3–4 вариантах + исходники",
      startupPack: "Дизайн-пакет «Стартап»",
      startupPackDesc: "Логотип + фирменный стиль + баннер для запуска бизнеса",
      webDesignLight2: "Дизайн сайта Лайт",
      webDesignLight2Desc: "Полный дизайн лендинга до 5 блоков",
      webDesignPro: "Дизайн сайта PRO",
      webDesignProDesc: "Дизайн многостраничного сайта (до 10 страниц)",
      ecommerce: "Дизайн интернет-магазина",
      ecommerceDesc: "Полный UI/UX дизайн e-commerce платформы",
      brandingPremium: "Брендинг Premium",
      brandingPremiumDesc: "Фирменный стиль компании + брендбук + гайдлайны",
      fullDesign: "Дизайн под ключ",
      fullDesignDesc:
        "Полный дизайн-пакет: сайт, соцсети, брендбук, маркетинговые материалы",
    },
    en: {
      title: "Design Services",
      subtitle: "Professional design services for your business",
      selectService: "1. Select service",
      enterDetails: "2. Enter your details",
      selectPayment: "3. Select payment method",
      popular: "Popular",
      from: "from",
      rub: "₽",
      delivery: "Delivery time",
      features: "What's included",
      orderButton: "Order Now",
      emailLabel: "Email *",
      nameLabel: "Name *",
      emailPlaceholder: "your@email.com",
      namePlaceholder: "Your name",
      miniEdit: "Mini Edit",
      miniEditDesc: "Small design edits (color, text, sizes)",
      basicElement: "Basic Element",
      basicElementDesc: "Creating one icon, button or simple banner",
      lightBanner: "Light Banner",
      lightBannerDesc: "Simple banner or product card design",
      socialStart: "Social Start",
      socialStartDesc: "Post/story design for Instagram, Telegram or TikTok",
      logoLight: "Logo Light",
      logoLightDesc: "Simple logo in 1-2 variants",
      brandMini: "Brand Style Mini",
      brandMiniDesc: "Basic set: logo + color scheme + fonts",
      webDesignLight: "Website Design Light",
      webDesignLightDesc: "1–2 website blocks (main section, product card)",
      businessBanner: "Business Banner",
      businessBannerDesc: "Banner pack for website or advertising (3–5 pcs)",
      socialPro: "Social PRO",
      socialProDesc: "Design set: avatar, banner, 5 post templates",
      logoPro: "Logo PRO",
      logoProDesc: "Premium logo in 3–4 variants + source files",
      startupPack: "Startup Design Pack",
      startupPackDesc: "Logo + brand style + banner for business launch",
      webDesignLight2: "Website Design Light",
      webDesignLight2Desc: "Full landing page design up to 5 blocks",
      webDesignPro: "Website Design PRO",
      webDesignProDesc: "Multi-page website design (up to 10 pages)",
      ecommerce: "E-commerce Design",
      ecommerceDesc: "Full UI/UX design for e-commerce platform",
      brandingPremium: "Branding Premium",
      brandingPremiumDesc: "Company brand style + brandbook + guidelines",
      fullDesign: "Full Design Package",
      fullDesignDesc:
        "Complete design package: website, social media, brandbook, marketing materials",
    },
  };

  const t =
    translations[locale as keyof typeof translations] || translations.ru;

  const serviceData: ServiceData = {
    id: 1,
    name: t.title,
    description: t.subtitle,
    image: "/feature-card.webp",
    currencyName: "RUB",
  };

  const selectedServiceData = designServices.find(
    (service) => service.id === selectedService
  );

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ${t.rub}`;
  };

  const { user: authUser } = useAuthStore();
  const { data: me } = useGetMe();

  const {
    createOrder,
    isLoading,
    isProcessingPayment,
    error: orderError,
    setError: setOrderError,
  } = useCreateOrder(selectedPaymentMethod, "RUB");

  const identifierCollected = useRef(false);

  // Get user identifier from various sources
  const getUserIdentifier = (): string | null => {
    if (authUser?.identifier) return authUser.identifier;
    if (me?.identifier) return me.identifier;
    if (authUser?.email) return authUser.email;
    if (me?.email) return me.email;
    return guestIdentifier || userEmail || null;
  };

  const isFormValid =
    (selectedService !== null || isCustomAmountSelected) &&
    userEmail.trim() !== "" &&
    userName.trim() !== "" &&
    selectedPaymentMethod !== "";

  const handleServiceSelect = (serviceId: number) => {
    setSelectedService(serviceId);
    // Сбрасываем произвольное количество при выборе пакета
    setCustomAmount(null);
    setCustomPrice(null);
    setIsCustomAmountSelected(false);
    // Auto-scroll to user details
    setTimeout(() => {
      const detailsSection = document.querySelector(
        '[data-step="user-details"]'
      );
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300);
  };

  const handleCustomAmountSelect = (amount: number, price: number) => {
    setCustomAmount(amount);
    setCustomPrice(price);
    setIsCustomAmountSelected(true);
    // Сбрасываем выбор обычной услуги
    setSelectedService(null);
  };

  const handleResetCustomAmount = () => {
    setCustomAmount(null);
    setCustomPrice(null);
    setIsCustomAmountSelected(false);
  };

  const handleEmailChange = (value: string) => {
    setUserEmail(value);
    if (
      value.trim() !== "" &&
      userName.trim() !== "" &&
      selectedService !== null
    ) {
      // Auto-scroll to payment
      setTimeout(() => {
        const paymentSection = document.querySelector('[data-step="payment"]');
        if (paymentSection) {
          paymentSection.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    }
  };

  const handleNameChange = (value: string) => {
    setUserName(value);
    if (
      value.trim() !== "" &&
      userEmail.trim() !== "" &&
      selectedService !== null
    ) {
      // Auto-scroll to payment
      setTimeout(() => {
        const paymentSection = document.querySelector('[data-step="payment"]');
        if (paymentSection) {
          paymentSection.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    }
  };

  const submitOrderWithIdentifier = (identifier: string) => {
    if (!isFormValid || (!selectedServiceData && !isCustomAmountSelected)) {
      setError("Please fill in all required fields");
      return;
    }

    // Определяем данные для заказа в зависимости от типа выбора
    let serviceId, amount, price;

    if (isCustomAmountSelected && customAmount && customPrice) {
      // Произвольное количество услуг
      serviceId = 999; // Специальный ID для произвольных услуг
      amount = customAmount;
      price = customPrice.toString();
    } else if (selectedServiceData) {
      // Стандартная услуга
      serviceId = selectedServiceData.id;
      amount = 1;
      price = selectedServiceData.price.toString();
    } else {
      setError("Please select a service or specify custom amount");
      return;
    }

    const orderData: CreateOrderDto = {
      identifier: identifier,
      game_id: serviceId,
      user_id: userName,
      currency_id: serviceId,
      amount: amount,
      price: price,
      payment_method: selectedPaymentMethod,
      user_game_id: userEmail,
      coupon_code: "",
    };

    createOrder(orderData)
      .then((response: any) => {
        console.log("Design service order created:", response);
      })
      .catch((err) => {
        console.error("❌ Order creation failed:", err);
        setError("Failed to create order. Please try again.");
      });
  };

  const handleSubmitOrder = async () => {
    setError("");

    if (!isFormValid || !selectedServiceData) {
      setError("Please fill in all required fields");
      return;
    }

    const userIdentifier = getUserIdentifier();

    if (!userIdentifier && !guestIdentifier && !identifierCollected.current) {
      setShowGuestAuthPopup(true);
      return;
    }

    const finalIdentifier = userIdentifier || guestIdentifier;

    if (!finalIdentifier) {
      setError("Email is required");
      return;
    }

    submitOrderWithIdentifier(finalIdentifier);
  };

  const handleGuestAuthSubmit = (identifier: string) => {
    setGuestIdentifier(identifier);
    setShowGuestAuthPopup(false);
    identifierCollected.current = true;
    submitOrderWithIdentifier(identifier);
  };

  // Mock reviews data
  const mockReviews = [
    {
      id: "review-1",
      userName: locale === "ru" ? "Александр К." : "Alexander K.",
      rating: 5,
      comment:
        locale === "ru"
          ? "Отличный сервис! Логотип получился именно таким, как я хотел. Быстро и качественно!"
          : "Excellent service! The logo turned out exactly as I wanted. Fast and high quality!",
      date: "2024-01-15T10:30:00Z",
      isVerified: true,
    },
    {
      id: "review-2",
      userName: locale === "ru" ? "Мария С." : "Maria S.",
      rating: 5,
      comment:
        locale === "ru"
          ? "Заказывала фирменный стиль. Все сделали в срок, очень довольна результатом!"
          : "Ordered brand identity. Everything was done on time, very satisfied with the result!",
      date: "2024-01-12T14:20:00Z",
      isVerified: true,
    },
  ];

  const mockMetadata = {
    totalReviews: 67,
    averageRating: 4.9,
    lastUpdated: "2024-01-15T10:30:00Z",
  };

  const mobileVersion = (
    <div className="md:hidden min-h-screen bg-white">
      <Banner backgroundImage="/feature-card.webp" height="120px" />
      <GameInfoBlock
        gameName={serviceData.name}
        title={serviceData.name}
        description={serviceData.description}
      />

      {/* Section title for mobile */}
      <div className="px-4 mt-6 mb-4">
        <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
          {t.selectService}
        </h2>
      </div>

      {/* Service Packages for mobile */}
      <div className="px-4">
        <div className="grid grid-cols-1 gap-4">
          {designServices.map((service) => (
            <div
              key={service.id}
              className={cn(
                "relative bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer transition-all duration-200",
                selectedService === service.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => handleServiceSelect(service.id)}
            >
              {service.popular && (
                <div className="absolute -top-2 left-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {t.popular}
                  </span>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {t[service.titleKey as keyof typeof t]}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {t[service.descriptionKey as keyof typeof t]}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(service.price)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {service.delivery}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Amount Selector for mobile */}
      {/* <CustomAmountSelector
        packages={designServices.map((service) => ({
          id: service.id,
          amount: 1,
          price: service.price.toString(),
          originalPriceRub: service.price,
          type: "service",
          sku: service.titleKey,
        }))}
        onCustomAmountSelect={handleCustomAmountSelect}
        currencyName="услуг"
        currencyImage=""
        isActive={isCustomAmountSelected}
        onReset={handleResetCustomAmount}
      /> */}

      {/* User Details Form */}
      <div data-step="user-details" className="px-4 mt-8">
        <h2 className="text-base md:text-lg font-bold text-gray-800 mb-4">
          {t.enterDetails}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.emailLabel}
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.nameLabel}
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={t.namePlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="px-4 py-8" data-step="payment">
        <h2 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">
          {t.selectPayment}
        </h2>
        <PaymentMethodSelector
          onSelect={setSelectedPaymentMethod}
          selectedMethod={selectedPaymentMethod}
          currentCurrency="RUB"
        />
      </div>

      {error && (
        <div className="px-4 mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-10">
        <button
          className={cn(
            "w-[180px] py-3 px-3 rounded-full text-white font-medium transition-colors shadow-lg",
            isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
          )}
          disabled={!isFormValid || isLoading}
          onClick={handleSubmitOrder}
        >
          {isLoading
            ? isProcessingPayment
              ? "Перенаправление..."
              : "Загрузка..."
            : t.orderButton}
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <InstructionTabs onTabChange={setActiveTab} defaultTab={activeTab} />
        {activeTab === "instruction" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {locale === "ru"
                ? "Как заказать услугу"
                : "How to order a service"}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                1.{" "}
                {locale === "ru"
                  ? "Выберите нужную услугу"
                  : "Select the service you need"}
              </p>
              <p>
                2.{" "}
                {locale === "ru"
                  ? "Заполните контактные данные"
                  : "Fill in contact details"}
              </p>
              <p>
                3.{" "}
                {locale === "ru"
                  ? "Выберите способ оплаты"
                  : "Choose payment method"}
              </p>
              <p>
                4. {locale === "ru" ? "Оплатите заказ" : "Pay for the order"}
              </p>
              <p>
                5.{" "}
                {locale === "ru"
                  ? "Мы свяжемся с вами для уточнения деталей"
                  : "We will contact you to clarify details"}
              </p>
            </div>
          </div>
        )}
        {activeTab === "description" && (
          <GameDescription
            gameName={serviceData.name}
            description={serviceData.description}
          />
        )}
        {activeTab === "reviews" && (
          <ReviewsSection reviews={mockReviews} metadata={mockMetadata} />
        )}
      </div>
    </div>
  );

  const desktopVersion = (
    <div className="hidden md:block max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Banner backgroundImage="/feature-card.webp" height="250px" />
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-6 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <GameInfoBlock
                gameName={serviceData.name}
                title={serviceData.name}
                description={serviceData.description}
              />
            </div>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                {t.selectService}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {designServices.map((service) => (
                  <div
                    key={service.id}
                    className={cn(
                      "relative bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer transition-all duration-200",
                      selectedService === service.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    {service.popular && (
                      <div className="absolute -top-2 left-4">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {t.popular}
                        </span>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {t[service.titleKey as keyof typeof t]}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {t[service.descriptionKey as keyof typeof t]}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(service.price)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {service.delivery}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedService === service.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          {t.features}:
                        </h4>
                        <ul className="space-y-1">
                          {service.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center text-xs text-gray-600"
                            >
                              <Check className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Custom Amount Selector for desktop */}
              {/* <div className="mt-6">
                <CustomAmountSelector
                  packages={designServices.map((service) => ({
                    id: service.id,
                    amount: 1,
                    price: service.price.toString(),
                    originalPriceRub: service.price,
                    type: "service",
                    sku: service.titleKey,
                  }))}
                  onCustomAmountSelect={handleCustomAmountSelect}
                  currencyName="услуг"
                  currencyImage=""
                  isActive={isCustomAmountSelected}
                  onReset={handleResetCustomAmount}
                />
              </div> */}
            </div>

            <div
              className="p-6 border-b border-gray-100"
              data-step="user-details"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {t.enterDetails}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="p-6" data-step="payment">
              <PaymentMethodSelector
                enhanced={true}
                onSelect={setSelectedPaymentMethod}
                selectedMethod={selectedPaymentMethod}
                currentCurrency="RUB"
              />
            </div>

            {error && (
              <div className="px-6 pb-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <InstructionTabs
                onTabChange={setActiveTab}
                defaultTab={activeTab}
              />
              {activeTab === "instruction" && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {locale === "ru"
                      ? "Как заказать услугу"
                      : "How to order a service"}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      1.{" "}
                      {locale === "ru"
                        ? "Выберите нужную услугу"
                        : "Select the service you need"}
                    </p>
                    <p>
                      2.{" "}
                      {locale === "ru"
                        ? "Заполните контактные данные"
                        : "Fill in contact details"}
                    </p>
                    <p>
                      3.{" "}
                      {locale === "ru"
                        ? "Выберите способ оплаты"
                        : "Choose payment method"}
                    </p>
                    <p>
                      4.{" "}
                      {locale === "ru" ? "Оплатите заказ" : "Pay for the order"}
                    </p>
                    <p>
                      5.{" "}
                      {locale === "ru"
                        ? "Мы свяжемся с вами для уточнения деталей"
                        : "We will contact you to clarify details"}
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "description" && (
                <GameDescription
                  gameName={serviceData.name}
                  description={serviceData.description}
                />
              )}
              {activeTab === "reviews" && (
                <ReviewsSection reviews={mockReviews} metadata={mockMetadata} />
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <OrderSummary
            game={serviceData}
            selectedCurrency={
              isCustomAmountSelected && customAmount && customPrice
                ? {
                    id: -1,
                    amount: customAmount,
                    price: formatPrice(customPrice),
                    originalPriceRub: customPrice,
                    type: "custom",
                    sku: "custom-services",
                  }
                : selectedServiceData
                ? {
                    id: selectedServiceData.id,
                    amount: 1,
                    price: formatPrice(selectedServiceData.price),
                    originalPriceRub: selectedServiceData.price,
                    type: selectedServiceData.titleKey,
                    sku: selectedServiceData.titleKey,
                  }
                : null
            }
            appliedDiscount={0}
            couponInfo={null}
            isFormValid={isFormValid}
            userId={userEmail}
            serverId=""
            onSubmit={handleSubmitOrder}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobileVersion}
      {desktopVersion}
      <GuestAuthPopup
        isOpen={showGuestAuthPopup}
        onClose={() => setShowGuestAuthPopup(false)}
        onSubmit={handleGuestAuthSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
