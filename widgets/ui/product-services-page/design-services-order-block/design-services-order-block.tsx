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

export function DesignServicesOrderBlock() {
  const locale = useLocale();
  const [selectedService, setSelectedService] = useState<number | null>(null);
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
      logoDesign: "Дизайн Логотипа",
      logoDesignDesc:
        "Создание уникального и запоминающегося логотипа для вашего бренда",
      brandingPackage: "Фирменный Стиль",
      brandingPackageDesc:
        "Полный пакет фирменного стиля: логотип, цвета, шрифты, визитки",
      websiteDesign: "Дизайн Сайта",
      websiteDesignDesc:
        "Современный адаптивный дизайн сайта с учетом UX/UI принципов",
      mobileAppDesign: "Дизайн Мобильного Приложения",
      mobileAppDesignDesc:
        "Дизайн интерфейса мобильного приложения для iOS и Android",
      uiuxDesign: "UI/UX Дизайн",
      uiuxDesignDesc: "Проектирование пользовательского опыта и интерфейса",
      socialMediaDesign: "Дизайн для Соцсетей",
      socialMediaDesignDesc:
        "Креативные посты, обложки и Stories для социальных сетей",
      printDesign: "Печатный Дизайн",
      printDesignDesc:
        "Дизайн полиграфической продукции с подготовкой к печати",
      motionGraphics: "Моушн Графика",
      motionGraphicsDesc:
        "Анимированные логотипы, промо-видео и интро для бренда",
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
      logoDesign: "Logo Design",
      logoDesignDesc: "Creating a unique and memorable logo for your brand",
      brandingPackage: "Brand Identity Package",
      brandingPackageDesc:
        "Complete brand identity package: logo, colors, fonts, business cards",
      websiteDesign: "Website Design",
      websiteDesignDesc:
        "Modern responsive website design following UX/UI principles",
      mobileAppDesign: "Mobile App Design",
      mobileAppDesignDesc: "Mobile app interface design for iOS and Android",
      uiuxDesign: "UI/UX Design",
      uiuxDesignDesc:
        "User experience and interface design with focus on usability",
      socialMediaDesign: "Social Media Design",
      socialMediaDesignDesc:
        "Creative posts, covers and Stories for your social media",
      printDesign: "Print Design",
      printDesignDesc: "Printing materials design with print-ready preparation",
      motionGraphics: "Motion Graphics",
      motionGraphicsDesc:
        "Animated logos, promo videos and intros for your brand",
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
    selectedService !== null &&
    userEmail.trim() !== "" &&
    userName.trim() !== "" &&
    selectedPaymentMethod !== "";

  const handleServiceSelect = (serviceId: number) => {
    setSelectedService(serviceId);
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
    if (!isFormValid || !selectedServiceData) {
      setError("Please fill in all required fields");
      return;
    }

    const orderData: CreateOrderDto = {
      identifier: identifier,
      game_id: selectedServiceData.id,
      user_id: userName,
      currency_id: selectedServiceData.id,
      amount: 1, // Service quantity
      price: selectedServiceData.price.toString(),
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
              selectedServiceData
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
