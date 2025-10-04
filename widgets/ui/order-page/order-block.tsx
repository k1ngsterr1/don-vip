"use client";

import { PaymentMethodSelector } from "@/entities/payment/ui/payment-method-selector";
import { cn } from "@/shared/utils/cn";
import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Diamond } from "lucide-react";
import Link from "next/link";
import { Banner } from "./banner/banner";
import { OrderSummary } from "./order-summary/order-summary";
import { UserIdForm } from "./user-id-form/user-id-form";
import { useCreateOrder } from "@/entities/order/hooks/use-create-order";
import type { CreateOrderDto } from "@/entities/order/model/types";
import { useProductWithHardcoded } from "@/entities/product/hooks/queries/use-product-with-hardcoded";
import { OrderBlockSkeleton } from "./loading/skeleton-loading";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useGetMe } from "@/entities/auth/hooks/use-auth";
import { GuestAuthPopup } from "@/entities/order/ui/guest-user-popup";
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import { useOrderCookies } from "@/shared/hooks/use-order-cookies";
import { SavedAccountsQuickSelect } from "./saved-accounts-quick-select/saved-accounts-quick-select";
import { DiamondPackages } from "./diamond-packages/diamond-packages";
import { CustomAmountSelector } from "./custom-amount-selector/custom-amount-selector";
import { ReviewsSection } from "./reviews-section/reviews-section";
import { FAQSection } from "./faq-section/faq-section";
import {
  InstructionTabs,
  InstructionContent,
} from "./instruction-section/instruction-section";
import { GameDescription } from "./game-description/game-description";
import { GameInfoBlock } from "./game-info-block/game-info-block";
import { useGameContent } from "@/entities/games/hooks/use-game-content";
import {
  getDesignServiceNameByPrice,
  isDesignServicePrice,
} from "@/shared/utils/design-service-names";

interface OrderBlockProps {
  gameSlug: number;
  initialExpandInfo?: boolean;
}

interface GameData {
  id: number;
  name: string;
  description: string;
  image: string;
  currencyName: string;
  currencyImage: string;
  isServerRequired: boolean;
}

interface CurrencyOption {
  id: number;
  amount: number;
  price: string;
  originalPriceRub: number;
  type: string;
  sku: string;
  discountPercent?: number;
  isDiscounted?: boolean;
  discount?: number; // legacy field
  isPopular?: boolean;
}

export function OrderBlock({
  gameSlug,
  initialExpandInfo = false, // Used to initialize showInfo state
}: OrderBlockProps) {
  const t = useTranslations("orderBlock");
  const locale = useLocale();
  const router = useRouter();
  const { data: product, isLoading: isProductLoading } =
    useProductWithHardcoded(gameSlug);

  // Хардкодные переводы для заголовков
  const translations = {
    ru: {
      selectPaymentMethod: "3. Выберите способ оплаты",
    },
    en: {
      selectPaymentMethod: "3. Select payment method",
    },
  };

  const orderTexts =
    translations[locale as keyof typeof translations] || translations.ru;

  // Map gameSlug to gameId for game content API
  const getGameIdFromSlug = (slug: number): string => {
    // Add mapping based on your product data structure
    // For now, let's use a simple mapping - you can extend this
    switch (slug) {
      case 1:
        return "bigo";
      case 2:
        return "mlbb"; // Mobile Legends Bang Bang
      case 3:
        return "pubg";
      default:
        return "bigo"; // fallback
    }
  };

  const { data: gameContent, isLoading: isGameContentLoading } = useGameContent(
    getGameIdFromSlug(gameSlug)
  );
  const { selectedCurrency: currentCurrency } = useCurrency();
  const [userIdDB, setUserIdDB] = useState("");
  const [game, setGame] = useState<GameData | null>(null);
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const [showInfo, setShowInfo] = useState(initialExpandInfo);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [isCustomAmountSelected, setIsCustomAmountSelected] = useState(false);
  const [showCustomAmountSelector, setShowCustomAmountSelector] =
    useState(false);
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [showGuestAuthPopup, setShowGuestAuthPopup] = useState(false);
  const [guestIdentifier, setGuestIdentifier] = useState("");
  const [isUserIdValid, setIsUserIdValid] = useState(true); // Добавляем состояние для валидности User ID
  const [activeTab, setActiveTab] = useState<
    "instruction" | "reviews" | "description" | "faq"
  >("instruction");

  // Функция для получения моковых отзывов в зависимости от локали и игры
  const getMockReviews = () => {
    const gameType = getGameIdFromSlug(gameSlug);

    if (locale === "ru") {
      // Русские отзывы для разных игр
      switch (gameType) {
        case "bigo":
          return [
            {
              id: "review-1",
              userName: "Александр К.",
              rating: 5,
              comment:
                "Отличный сервис! Алмазы Bigo пришли моментально, никаких проблем. Буду пользоваться еще!",
              date: "2024-01-15T10:30:00Z",
              isVerified: true,
            },
            {
              id: "review-2",
              userName: "Мария С.",
              rating: 5,
              comment:
                "Быстро и надежно. Заказывала алмазы Bigo уже несколько раз - всегда все четко работает.",
              date: "2024-01-12T14:20:00Z",
              isVerified: true,
            },
            {
              id: "review-3",
              userName: "Дмитрий В.",
              rating: 4,
              comment:
                "Хорошие цены на алмазы Bigo, быстрая доставка. Рекомендую!",
              date: "2024-01-10T09:15:00Z",
              isVerified: false,
            },
            {
              id: "review-4",
              userName: "Анна Л.",
              rating: 5,
              comment:
                "Супер сервис! Алмазы Bigo зачислились за 2 минуты. Очень довольна покупкой.",
              date: "2024-01-08T16:45:00Z",
              isVerified: true,
            },
            {
              id: "review-5",
              userName: "Игорь М.",
              rating: 5,
              comment:
                "Пользуюсь уже полгода, покупаю алмазы Bigo - никогда не подводили. Цены адекватные, поддержка отвечает быстро.",
              date: "2024-01-05T11:30:00Z",
              isVerified: true,
            },
          ];
        case "mlbb":
          return [
            {
              id: "review-1",
              userName: "Александр К.",
              rating: 5,
              comment:
                "Отличный сервис! Алмазы Mobile Legends пришли моментально, никаких проблем. Буду пользоваться еще!",
              date: "2024-01-15T10:30:00Z",
              isVerified: true,
            },
            {
              id: "review-2",
              userName: "Мария С.",
              rating: 5,
              comment:
                "Быстро и надежно. Заказывала алмазы ML уже несколько раз - всегда все четко работает.",
              date: "2024-01-12T14:20:00Z",
              isVerified: true,
            },
            {
              id: "review-3",
              userName: "Дмитрий В.",
              rating: 4,
              comment:
                "Хорошие цены на алмазы Mobile Legends, быстрая доставка. Рекомендую!",
              date: "2024-01-10T09:15:00Z",
              isVerified: false,
            },
            {
              id: "review-4",
              userName: "Анна Л.",
              rating: 5,
              comment:
                "Супер сервис! Алмазы ML зачислились за 2 минуты. Очень довольна покупкой.",
              date: "2024-01-08T16:45:00Z",
              isVerified: true,
            },
            {
              id: "review-5",
              userName: "Игорь М.",
              rating: 5,
              comment:
                "Пользуюсь уже полгода, покупаю алмазы Mobile Legends - никогда не подводили. Цены адекватные, поддержка отвечает быстро.",
              date: "2024-01-05T11:30:00Z",
              isVerified: true,
            },
          ];
        case "pubg":
          return [
            {
              id: "review-1",
              userName: "Александр К.",
              rating: 5,
              comment:
                "Отличный сервис! UC PUBG пришли моментально, никаких проблем. Буду пользоваться еще!",
              date: "2024-01-15T10:30:00Z",
              isVerified: true,
            },
            {
              id: "review-2",
              userName: "Мария С.",
              rating: 5,
              comment:
                "Быстро и надежно. Заказывала UC уже несколько раз - всегда все четко работает.",
              date: "2024-01-12T14:20:00Z",
              isVerified: true,
            },
            {
              id: "review-3",
              userName: "Дмитрий В.",
              rating: 4,
              comment: "Хорошие цены на UC PUBG, быстрая доставка. Рекомендую!",
              date: "2024-01-10T09:15:00Z",
              isVerified: false,
            },
            {
              id: "review-4",
              userName: "Анна Л.",
              rating: 5,
              comment:
                "Супер сервис! UC зачислились за 2 минуты. Очень довольна покупкой.",
              date: "2024-01-08T16:45:00Z",
              isVerified: true,
            },
            {
              id: "review-5",
              userName: "Игорь М.",
              rating: 5,
              comment:
                "Пользуюсь уже полгода, покупаю UC - никогда не подводили. Цены адекватные, поддержка отвечает быстро.",
              date: "2024-01-05T11:30:00Z",
              isVerified: true,
            },
          ];
        default:
          return [
            {
              id: "review-1",
              userName: "Александр К.",
              rating: 5,
              comment:
                "Отличный сервис! Валюта пришла моментально, никаких проблем. Буду пользоваться еще!",
              date: "2024-01-15T10:30:00Z",
              isVerified: true,
            },
            {
              id: "review-2",
              userName: "Мария С.",
              rating: 5,
              comment:
                "Быстро и надежно. Заказывала уже несколько раз - всегда все четко работает.",
              date: "2024-01-12T14:20:00Z",
              isVerified: true,
            },
            {
              id: "review-3",
              userName: "Дмитрий В.",
              rating: 4,
              comment: "Хорошие цены, быстрая доставка. Рекомендую!",
              date: "2024-01-10T09:15:00Z",
              isVerified: false,
            },
            {
              id: "review-4",
              userName: "Анна Л.",
              rating: 5,
              comment:
                "Супер сервис! Валюта зачислилась за 2 минуты. Очень довольна покупкой.",
              date: "2024-01-08T16:45:00Z",
              isVerified: true,
            },
            {
              id: "review-5",
              userName: "Игорь М.",
              rating: 5,
              comment:
                "Пользуюсь уже полгода, никогда не подводили. Цены адекватные, поддержка отвечает быстро.",
              date: "2024-01-05T11:30:00Z",
              isVerified: true,
            },
          ];
      }
    } else {
      // English reviews for different games
      switch (gameType) {
        case "bigo":
          return [
            {
              id: "review-1",
              userName: "Alexander K.",
              rating: 5,
              comment:
                "Excellent service! Bigo diamonds arrived instantly, no problems. Will use again!",
              date: "2024-01-15T10:30:00Z",
              isVerified: true,
            },
            {
              id: "review-2",
              userName: "Maria S.",
              rating: 5,
              comment:
                "Fast and reliable. Ordered Bigo diamonds several times - always works perfectly.",
              date: "2024-01-12T14:20:00Z",
              isVerified: true,
            },
            {
              id: "review-3",
              userName: "Dmitry V.",
              rating: 4,
              comment:
                "Good prices for Bigo diamonds, fast delivery. Recommend!",
              date: "2024-01-10T09:15:00Z",
              isVerified: false,
            },
            {
              id: "review-4",
              userName: "Anna L.",
              rating: 5,
              comment:
                "Super service! Bigo diamonds were credited in 2 minutes. Very satisfied with the purchase.",
              date: "2024-01-08T16:45:00Z",
              isVerified: true,
            },
            {
              id: "review-5",
              userName: "Igor M.",
              rating: 5,
              comment:
                "Using for half a year, buying Bigo diamonds - never let me down. Fair prices, support responds quickly.",
              date: "2024-01-05T11:30:00Z",
              isVerified: true,
            },
          ];
        case "mlbb":
          return [
            {
              id: "review-1",
              userName: "Alexander K.",
              rating: 5,
              comment:
                "Excellent service! Mobile Legends diamonds arrived instantly, no problems. Will use again!",
              date: "2024-01-15T10:30:00Z",
              isVerified: true,
            },
            {
              id: "review-2",
              userName: "Maria S.",
              rating: 5,
              comment:
                "Fast and reliable. Ordered ML diamonds several times - always works perfectly.",
              date: "2024-01-12T14:20:00Z",
              isVerified: true,
            },
            {
              id: "review-3",
              userName: "Dmitry V.",
              rating: 4,
              comment:
                "Good prices for Mobile Legends diamonds, fast delivery. Recommend!",
              date: "2024-01-10T09:15:00Z",
              isVerified: false,
            },
            {
              id: "review-4",
              userName: "Anna L.",
              rating: 5,
              comment:
                "Super service! ML diamonds were credited in 2 minutes. Very satisfied with the purchase.",
              date: "2024-01-08T16:45:00Z",
              isVerified: true,
            },
            {
              id: "review-5",
              userName: "Igor M.",
              rating: 5,
              comment:
                "Using for half a year, buying Mobile Legends diamonds - never let me down. Fair prices, support responds quickly.",
              date: "2024-01-05T11:30:00Z",
              isVerified: true,
            },
          ];
        case "pubg":
          return [
            {
              id: "review-1",
              userName: "Alexander K.",
              rating: 5,
              comment:
                "Excellent service! PUBG UC arrived instantly, no problems. Will use again!",
              date: "2024-01-15T10:30:00Z",
              isVerified: true,
            },
            {
              id: "review-2",
              userName: "Maria S.",
              rating: 5,
              comment:
                "Fast and reliable. Ordered UC several times - always works perfectly.",
              date: "2024-01-12T14:20:00Z",
              isVerified: true,
            },
            {
              id: "review-3",
              userName: "Dmitry V.",
              rating: 4,
              comment: "Good prices for PUBG UC, fast delivery. Recommend!",
              date: "2024-01-10T09:15:00Z",
              isVerified: false,
            },
            {
              id: "review-4",
              userName: "Anna L.",
              rating: 5,
              comment:
                "Super service! UC was credited in 2 minutes. Very satisfied with the purchase.",
              date: "2024-01-08T16:45:00Z",
              isVerified: true,
            },
            {
              id: "review-5",
              userName: "Igor M.",
              rating: 5,
              comment:
                "Using for half a year, buying UC - never let me down. Fair prices, support responds quickly.",
              date: "2024-01-05T11:30:00Z",
              isVerified: true,
            },
          ];
        default:
          return [
            {
              id: "review-1",
              userName: "Alexander K.",
              rating: 5,
              comment:
                "Excellent service! Currency arrived instantly, no problems. Will use again!",
              date: "2024-01-15T10:30:00Z",
              isVerified: true,
            },
            {
              id: "review-2",
              userName: "Maria S.",
              rating: 5,
              comment:
                "Fast and reliable. Ordered several times - always works perfectly.",
              date: "2024-01-12T14:20:00Z",
              isVerified: true,
            },
            {
              id: "review-3",
              userName: "Dmitry V.",
              rating: 4,
              comment: "Good prices, fast delivery. Recommend!",
              date: "2024-01-10T09:15:00Z",
              isVerified: false,
            },
            {
              id: "review-4",
              userName: "Anna L.",
              rating: 5,
              comment:
                "Super service! Currency was credited in 2 minutes. Very satisfied with the purchase.",
              date: "2024-01-08T16:45:00Z",
              isVerified: true,
            },
            {
              id: "review-5",
              userName: "Igor M.",
              rating: 5,
              comment:
                "Using for half a year, never let me down. Fair prices, support responds quickly.",
              date: "2024-01-05T11:30:00Z",
              isVerified: true,
            },
          ];
      }
    }
  };

  const mockReviews = getMockReviews();

  const mockMetadata = {
    totalReviews: 127,
    averageRating: 4.8,
    lastUpdated: "2024-01-15T10:30:00Z",
  };

  // Функция для автоматического перехода к методам оплаты
  const scrollToPaymentSection = () => {
    setTimeout(() => {
      const paymentSection = document.querySelector('[data-step="payment"]');
      if (paymentSection) {
        paymentSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 500);
  };

  // Обработчик для валидного ввода User ID
  const handleUserIdValidation = (isValid: boolean) => {
    setIsUserIdValid(isValid);

    // Если ID валиден и выбран пакет, автоматически переходим к оплате
    if (isValid && selectedAmount !== null && userId.trim() !== "") {
      // Для игр требующих сервер, проверяем что сервер ID тоже введен
      if (game?.isServerRequired && serverId.trim() === "") {
        return; // Не переходим если сервер ID не введен
      }

      scrollToPaymentSection();
    }
  };

  // Обработчик изменения User ID
  const handleUserIdChange = (value: string) => {
    setUserId(value);

    // Save game data to cookies when user enters valid ID
    if (value.trim().length >= 4 && game?.id) {
      saveGameData({
        gameId: game.id,
        accountId: value.trim(),
        serverId: serverId || undefined,
        gameName: game.name,
        lastUsed: Date.now(),
      });
    }

    // Если ID достаточно длинный и выбран пакет, автоматически переходим к оплате
    if (value.trim().length >= 4 && selectedAmount !== null) {
      // Для игр требующих сервер, проверяем что сервер ID тоже введен
      if (game?.isServerRequired && serverId.trim() === "") {
        return; // Не переходим если сервер ID не введен
      }

      scrollToPaymentSection();
    }
  };

  // Обработчик изменения Server ID
  const handleServerIdChange = (value: string) => {
    setServerId(value);

    // Save game data to cookies when user enters server ID
    if (value.trim().length >= 1 && userId.trim().length >= 4 && game?.id) {
      saveGameData({
        gameId: game.id,
        accountId: userId.trim(),
        serverId: value.trim(),
        gameName: game.name,
        lastUsed: Date.now(),
      });
    }

    // Если все поля заполнены и выбран пакет, автоматически переходим к оплате
    if (
      value.trim().length >= 1 &&
      userId.trim().length >= 4 &&
      selectedAmount !== null
    ) {
      scrollToPaymentSection();
    }
  };

  // Обработчик выбора сохраненного аккаунта
  const handleSavedAccountSelect = (accountId: string, serverId?: string) => {
    setUserId(accountId);
    if (serverId) {
      setServerId(serverId);
    }

    // Update saved data timestamp
    if (game?.id) {
      saveGameData({
        gameId: game.id,
        accountId: accountId,
        serverId: serverId,
        gameName: game.name,
        lastUsed: Date.now(),
      });
    }

    // Auto-scroll to payment if package is selected
    if (selectedAmount !== null) {
      // Check if server is required and provided
      if (!game?.isServerRequired || serverId) {
        setTimeout(() => scrollToPaymentSection(), 300);
      }
    }
  };

  // Убираем автоматическое переключение на pagsmile_checkout
  // чтобы пользователь мог выбирать конкретные методы оплаты
  // useEffect(() => {
  //   if (currentCurrency.code !== "RUB") {
  //     // For non-RUB currencies, use a generic payment method for Pagsmile checkout
  //     setSelectedPaymentMethod("pagsmile_checkout");
  //   } else if (selectedPaymentMethod === "pagsmile_checkout") {
  //     // If switching back to RUB, reset to default RUB method
  //     setSelectedPaymentMethod("tbank");
  //   }
  // }, [currentCurrency.code]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponInfo, setCouponInfo] = useState<any>(null);

  // Flag to prevent popup from showing twice
  const identifierCollected = useRef(false);

  const {
    createOrder,
    isLoading,
    isProcessingPayment,
    error,
    setError,
    isGuestUser,
    needsIdentifier,
    shouldUsePagsmileCheckout,
  } = useCreateOrder(selectedPaymentMethod, currentCurrency.code);

  const { user: authUser, isGuestAuth } = useAuthStore();
  const { data: me } = useGetMe();
  const { fillFormFromLastOrder, getGameData, saveGameData } =
    useOrderCookies();
  const searchParams = useSearchParams();

  // Проверяем статус платежа при возврате с PayMaster или других платежных провайдеров
  useEffect(() => {
    const paymentStatus = searchParams.get("payment_status");
    const orderId = searchParams.get("order_id");
    const paymentError = searchParams.get("error");
    const isPaymentReturn = searchParams.get("from_payment");

    if (paymentStatus || orderId || paymentError || isPaymentReturn) {
      console.log("Returned from payment with:", {
        paymentStatus,
        orderId,
        paymentError,
        isPaymentReturn,
      });

      // Если есть ошибка или статус "failed" или "cancel"
      if (
        paymentError ||
        paymentStatus === "failed" ||
        paymentStatus === "cancel" ||
        paymentStatus === "cancelled"
      ) {
        setError(
          "Платеж был отменен или произошла ошибка. Попробуйте еще раз."
        );
        // Очищаем URL от параметров платежа
        const url = new URL(window.location.href);
        url.searchParams.delete("payment_status");
        url.searchParams.delete("order_id");
        url.searchParams.delete("error");
        url.searchParams.delete("from_payment");
        router.replace(url.pathname + url.search);
      }

      // Если платеж успешен, перенаправляем на страницу успеха
      if (paymentStatus === "success" && orderId) {
        router.push(`/product/success/${orderId}`);
      }

      // Если просто вернулись с платежа без статуса - показываем предупреждение
      if (isPaymentReturn && !paymentStatus && !paymentError) {
        setError(
          "Возврат с платежной страницы. Если оплата не завершена, попробуйте еще раз."
        );
        // Очищаем URL
        const url = new URL(window.location.href);
        url.searchParams.delete("from_payment");
        router.replace(url.pathname + url.search);
      }
    }
  }, [searchParams, router, setError]);

  // Дополнительная проверка - если есть только order_id без статуса (незавершенный платеж)
  useEffect(() => {
    const orderId = searchParams.get("order_id");
    const paymentStatus = searchParams.get("payment_status");

    if (orderId && !paymentStatus) {
      // Заказ создан, но статус платежа неизвестен
      console.log("Order created but payment status unknown:", orderId);
      setError(
        "Заказ создан, но статус оплаты неизвестен. Проверьте историю заказов или попробуйте оплатить заново."
      );

      // Очищаем URL
      const url = new URL(window.location.href);
      url.searchParams.delete("order_id");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router, setError]);

  // Обработчик возврата фокуса на страницу (когда пользователь закрыл вкладку с платежом)
  useEffect(() => {
    let paymentWindowClosed = false;

    const handleVisibilityChange = () => {
      if (!document.hidden && isProcessingPayment && paymentWindowClosed) {
        // Пользователь вернулся на страницу во время обработки платежа
        setError(
          "Платежное окно было закрыто. Если оплата не завершена, попробуйте еще раз."
        );
        // Сбрасываем состояние обработки платежа (это должно делаться в useCreateOrder)
      }
    };

    if (isProcessingPayment) {
      paymentWindowClosed = true;
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isProcessingPayment, setError]);

  useEffect(() => {
    const local_user = localStorage.getItem("userId");
    if (local_user && local_user.trim() !== "") {
      setUserIdDB(local_user.trim());
    } else {
      setUserIdDB(""); // или вообще не устанавливай, если ты обрабатываешь undefined/null
    }

    if (product) {
      let replenishmentArray = [];

      try {
        if (typeof product.replenishment === "string") {
          replenishmentArray = JSON.parse(product.replenishment);
        } else if (Array.isArray(product.replenishment)) {
          replenishmentArray = product.replenishment;
        }
      } catch (error) {
        replenishmentArray = [];
      }

      const currencyType =
        replenishmentArray.length > 0 ? replenishmentArray[0].type : "";

      // Правильное получение названия игровой валюты с бэка
      const formattedCurrencyName = currencyType
        ? currencyType.charAt(0).toUpperCase() + currencyType.slice(1)
        : product.type === "Bigo"
        ? "Diamonds"
        : "Coins";

      setGame({
        id: product.id,
        name: product.name,
        description:
          locale === "ru" ? product.description : product.description_en,
        image: product.image,
        currencyName: formattedCurrencyName, // Используем название из replenishment.type, а не currency_name
        currencyImage:
          product.currency_image ||
          `/currency-${product.type.toLowerCase()}.png`,
        isServerRequired: product.isServerRequired || false,
      });

      setCurrencyOptions(
        replenishmentArray.map((item: any, index: number) => {
          // Convert price from RUB to selected currency
          const priceInRub = item.price;
          const convertedPrice =
            currentCurrency.code === "RUB"
              ? priceInRub
              : priceInRub * currentCurrency.rate; // Multiply by rate (how many foreign currency units per 1 RUB)

          // Use only real discount data from replenishment
          const isPopular = index === 0; // First item is popular
          const discountPercent =
            item.discountPercent && item.discountPercent > 0
              ? item.discountPercent
              : undefined; // НЕ передаем discountPercent если его нет или он 0
          const isDiscounted = discountPercent ? discountPercent > 0 : false;

          const packageData: any = {
            id: index,
            amount: item.amount,
            price: `${convertedPrice.toFixed(2)} ${currentCurrency.code}`,
            originalPriceRub: priceInRub, // Keep original RUB price for order
            type: item.type,
            sku: item.sku,
          };

          // Добавляем ТОЛЬКО поля которые действительно существуют и не равны 0
          if (discountPercent && discountPercent > 0) {
            packageData.discountPercent = discountPercent;
            packageData.isDiscounted = true;
          }

          if (index === 0) {
            packageData.isPopular = true;
          }

          // Добавляем ЛЮБЫЕ другие поля из item, но ТОЛЬКО если они не равны 0
          Object.keys(item).forEach((key) => {
            if (
              !["price", "amount", "type", "sku", "discountPercent"].includes(
                key
              )
            ) {
              const value = item[key];
              if (
                value !== 0 &&
                value !== "0" &&
                value !== null &&
                value !== undefined &&
                value !== ""
              ) {
                packageData[key] = value;
              }
            }
          });

          console.log(`Package ${index} creation:`, {
            originalDiscountPercent: item.discountPercent,
            processedDiscountPercent: discountPercent,
            finalPackageData: packageData,
          });

          return packageData;
        })
      );
    }
  }, [product, currentCurrency]);

  // Load saved game data from cookies when game changes
  useEffect(() => {
    if (game?.id) {
      const savedData = fillFormFromLastOrder(game.id);
      if (savedData.hasData) {
        setUserId(savedData.accountId);
        if (savedData.serverId) {
          setServerId(savedData.serverId);
        }
      }
    }
  }, [game?.id, fillFormFromLastOrder]);

  if (isProductLoading || isGameContentLoading || !game) {
    return <OrderBlockSkeleton />;
  }

  const selectedCurrency =
    isCustomAmountSelected && customAmount && customPrice
      ? {
          id: -1, // Специальный ID для произвольного количества
          amount: customAmount,
          price: customPrice.toFixed(2),
          originalPriceRub: customPrice,
          type: "custom",
          sku: "custom",
        }
      : currencyOptions.find((c) => c.id === selectedAmount) || null;

  const isFormValid =
    (selectedCurrency !== null ||
      (isCustomAmountSelected &&
        customAmount !== null &&
        customPrice !== null)) &&
    userId.trim() !== "" &&
    (!game.isServerRequired || serverId.trim() !== "") &&
    isUserIdValid;

  // Get user identifier from various sources
  const getUserIdentifier = (): string | null => {
    if (authUser?.identifier) return authUser.identifier;
    if (me?.identifier) return me.identifier;
    if (authUser?.email) return authUser.email;
    if (me?.email) return me.email;
    return guestIdentifier || null;
  };

  // Обработчики для произвольного количества
  const handleCustomAmountSelect = (amount: number, price: number) => {
    setCustomAmount(amount);
    setCustomPrice(price);
    setIsCustomAmountSelected(true);
    setSelectedAmount(null); // Сбрасываем стандартный выбор
  };

  const handleCustomAmountReset = () => {
    setCustomAmount(null);
    setCustomPrice(null);
    setIsCustomAmountSelected(false);
    setShowCustomAmountSelector(false);
  };

  const handleCustomAmountShow = () => {
    setShowCustomAmountSelector(true);
    setSelectedAmount(null); // Сбрасываем выбор пакета
  };

  const handlePackageSelect = (packageId: number) => {
    setSelectedAmount(packageId);
    // Сбрасываем произвольное количество при выборе стандартного пакета
    setIsCustomAmountSelected(false);
    setCustomAmount(null);
    setCustomPrice(null);
    setShowCustomAmountSelector(false);
  };

  const handleCouponApplied = (discount: number, couponData: any) => {
    setAppliedDiscount(discount);
    setCouponInfo(couponData);
  };

  const submitOrderWithIdentifier = (identifier: string) => {
    if (!isFormValid || !selectedCurrency) {
      setError("Please fill in all required fields");
      return;
    }

    // Calculate prices for both RUB and converted currency
    const originalPriceRub = selectedCurrency.originalPriceRub;
    const originalPriceConverted =
      currentCurrency.code === "RUB"
        ? originalPriceRub
        : originalPriceRub * currentCurrency.rate;

    // Calculate discount in RUB
    const discountAmountRub =
      couponInfo?.type === "percentage"
        ? (originalPriceRub * appliedDiscount) / 100
        : appliedDiscount;

    // Calculate final prices
    const finalPriceRub = Math.max(0, originalPriceRub - discountAmountRub);
    const finalPriceConverted =
      currentCurrency.code === "RUB"
        ? finalPriceRub
        : finalPriceRub * currentCurrency.rate;

    // Use converted price for the order (what the user actually pays)
    const formattedPrice = finalPriceConverted.toFixed(2);

    const orderData: CreateOrderDto = {
      identifier: identifier,
      game_id: game.id,
      user_id: userIdDB,
      currency_id: selectedCurrency.id,
      amount: selectedCurrency.amount,
      price: formattedPrice,
      payment_method: selectedPaymentMethod,
      user_game_id: !userId || userId.trim() === "" ? "unknown" : userId,
      server_id: game.isServerRequired ? serverId : undefined,
      coupon_code: couponInfo?.code || undefined,
    };

    createOrder(orderData)
      .then((response: any) => {
        if (
          selectedPaymentMethod === "tbank" &&
          currentCurrency.code === "RUB"
        ) {
          // Формируем название пакета для чека
          const priceInRub = Math.round(finalPriceRub); // Округляем до целого числа
          let packageName: string;

          if (isDesignServicePrice(priceInRub)) {
            // Если цена соответствует дизайнерской услуге, используем её название
            packageName = getDesignServiceNameByPrice(priceInRub, locale);
          } else {
            // Иначе используем стандартное название с количеством и валютой
            packageName = `${selectedCurrency.amount} ${game.currencyName}`;
          }

          const params = new URLSearchParams({
            orderId: response.id,
            amount: selectedCurrency.amount.toString(),
            price: formattedPrice, // Changed from numericPrice to formattedPrice (discounted price)
            currencyName: game.currencyName,
            gameName: game.name,
            packageName: packageName,
            userId: userId,
            userIdDB: userIdDB,
            serverId: game.isServerRequired ? serverId : "",
          });

          window.location.href = `/t-bank?${params.toString()}`;
        } else {
          // Handle other payment methods here
          console.log(
            "Order created successfully for non-RUB currency:",
            response
          );
          // You can redirect to a different payment processor or show success message
        }
      })
      .catch((err) => {
        console.error("❌ Order creation failed:", err);
        setError("Failed to create order. Please try again.");
      });
  };

  const handleSubmitOrder = async () => {
    setError("");

    if (!isFormValid || !selectedCurrency) {
      setError("Please fill in all required fields");
      return;
    }

    // Get user identifier from various sources
    const userIdentifier = getUserIdentifier();

    // Force popup for testing - remove this condition later
    const shouldShowPopup =
      !userIdentifier && !guestIdentifier && !identifierCollected.current;

    if (shouldShowPopup) {
      setShowGuestAuthPopup(true);
      return;
    }

    // Use available identifier
    const finalIdentifier = userIdentifier || guestIdentifier;

    if (!finalIdentifier) {
      setError("Email or phone number is required");
      return;
    }

    submitOrderWithIdentifier(finalIdentifier);
  };

  const handleGuestAuthSubmit = (identifier: string) => {
    setGuestIdentifier(identifier);
    setShowGuestAuthPopup(false);
    identifierCollected.current = true;

    // Submit the order with the collected identifier
    submitOrderWithIdentifier(identifier);
  };

  const mobileVersion = (
    <div className="md:hidden min-h-screen bg-white">
      <Banner backgroundImage={game.image || "/banner.png"} height="120px" />
      <GameInfoBlock
        gameName={game.name}
        gameName_en={gameContent?.gameName_en}
        title={gameContent?.title}
        title_en={gameContent?.title_en}
        description={gameContent?.description}
        description_en={gameContent?.description_en}
      />
      {/* <PromoBlock onLoginClick={() => console.log("Login clicked")} /> */}

      {/* Section title for mobile */}
      <div className="px-4 mt-6 mb-4">
        <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
          1. {t("block.selectAmount")}
        </h2>
      </div>

      {/* Diamond Packages for mobile */}
      <DiamondPackages
        packages={currencyOptions}
        onSelect={handlePackageSelect}
        selectedId={selectedAmount}
        currencyName={currentCurrency.code}
        currencyImage={game.currencyImage}
        productId={gameSlug}
        onCustomAmountClick={handleCustomAmountShow}
        showCustomAmountButton={true}
      />

      {/* Custom Amount Selector for mobile */}
      {showCustomAmountSelector && (
        <CustomAmountSelector
          packages={currencyOptions}
          onCustomAmountSelect={handleCustomAmountSelect}
          currencyName={currentCurrency.code}
          currencyImage={game.currencyImage}
          isActive={isCustomAmountSelected}
          onReset={handleCustomAmountReset}
        />
      )}

      <div data-step="user-id" className="px-4 md:px-0">
        {/* Saved Accounts Quick Select */}
        {/* <SavedAccountsQuickSelect
          gameId={game.id}
          onAccountSelect={handleSavedAccountSelect}
          className="mb-4"
        /> */}

        <UserIdForm
          apiGame={product?.smile_api_game}
          productType={product?.type}
          gameData={game}
          gameId={gameSlug}
          productRequirements={{
            isServerRequired: product?.isServerRequired,
            requireUserId: product?.requireUserId,
            requireServer: product?.requireServer,
            requireEmail: product?.requireEmail,
            requireUID: product?.requireUID,
          }}
          userId={userId}
          serverId={serverId}
          onUserIdChange={handleUserIdChange}
          onServerIdChange={handleServerIdChange}
          onValidationChange={handleUserIdValidation}
        />
      </div>

      {/* Payment Method Selector */}
      <div className="px-4 py-[34px] pb-0" data-step="payment">
        <h2 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">
          {orderTexts.selectPaymentMethod}
        </h2>
        <PaymentMethodSelector
          onSelect={setSelectedPaymentMethod}
          selectedMethod={selectedPaymentMethod}
          currentCurrency={currentCurrency.code}
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
            isFormValid ? "bg-[#aaaaab] hover:bg-gray-600" : "bg-gray-400"
          )}
          disabled={!isFormValid || isLoading}
          onClick={handleSubmitOrder}
        >
          {isLoading
            ? isProcessingPayment
              ? "Перенаправление..."
              : "Загрузка..."
            : "Купить сейчас"}
        </button>
      </div>
      <div className="mt-6 space-y-6">
        <div className="">
          <InstructionTabs onTabChange={setActiveTab} defaultTab={activeTab} />
          {activeTab === "instruction" && (
            <InstructionContent
              gameName={game.name}
              gameContent={gameContent}
            />
          )}
          {activeTab === "description" && (
            <GameDescription
              gameName={game.name}
              description={game.description}
            />
          )}
          {activeTab === "faq" && <FAQSection items={gameContent?.faq} />}
          {activeTab === "reviews" && (
            <ReviewsSection
              reviews={
                gameContent?.reviews?.length ? gameContent.reviews : mockReviews
              }
              metadata={gameContent?.metadata || mockMetadata}
            />
          )}
        </div>
      </div>
    </div>
  );

  const desktopVersion = (
    <div className="hidden md:block max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Banner
            backgroundImage={game.image || "/banner.png"}
            height="250px"
          />
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-6 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="">
                <GameInfoBlock
                  gameName={game.name}
                  gameName_en={gameContent?.gameName_en}
                  title={gameContent?.title}
                  title_en={gameContent?.title_en}
                  description={gameContent?.description}
                  description_en={gameContent?.description_en}
                />
              </div>
              {/* <div>
                <PromoBlock />
              </div> */}
            </div>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                1. {t("block.selectAmount")}
              </h2>
              <DiamondPackages
                packages={currencyOptions}
                onSelect={handlePackageSelect}
                selectedId={selectedAmount}
                currencyName={currentCurrency.code}
                currencyImage={game.currencyImage}
                productId={gameSlug}
                onCustomAmountClick={handleCustomAmountShow}
                showCustomAmountButton={true}
              />

              {/* Custom Amount Selector for desktop */}
              {showCustomAmountSelector && (
                <div className="mt-6">
                  <CustomAmountSelector
                    packages={currencyOptions}
                    onCustomAmountSelect={handleCustomAmountSelect}
                    currencyName={currentCurrency.code}
                    currencyImage={game.currencyImage}
                    isActive={isCustomAmountSelected}
                    onReset={handleCustomAmountReset}
                  />
                </div>
              )}
            </div>
            <div
              className="p-6 border-b   border-gray-100"
              data-step="user-id"
              id="desktop-user-id-section"
            >
              {/* Saved Accounts Quick Select for Desktop */}
              {/* <SavedAccountsQuickSelect
                gameId={game.id}
                onAccountSelect={handleSavedAccountSelect}
                className="mb-6"
              /> */}

              <UserIdForm
                apiGame={product?.smile_api_game}
                productType={product?.type}
                gameData={game}
                gameId={gameSlug}
                productRequirements={{
                  isServerRequired: product?.isServerRequired,
                  requireUserId: product?.requireUserId,
                  requireServer: product?.requireServer,
                  requireEmail: product?.requireEmail,
                  requireUID: product?.requireUID,
                }}
                userId={userId}
                serverId={serverId}
                onUserIdChange={handleUserIdChange}
                onServerIdChange={handleServerIdChange}
                onValidationChange={handleUserIdValidation}
              />
            </div>
            {/* PaymentMethodSelector is now shown for all currencies in enhanced mode */}
            <div className="p-6" data-step="payment">
              <PaymentMethodSelector
                enhanced={true}
                onSelect={setSelectedPaymentMethod}
                selectedMethod={selectedPaymentMethod}
                currentCurrency={currentCurrency.code}
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
              <div className="">
                <InstructionTabs
                  onTabChange={setActiveTab}
                  defaultTab={activeTab}
                />
                {activeTab === "instruction" && (
                  <InstructionContent
                    gameName={game.name}
                    gameContent={gameContent}
                  />
                )}
                {activeTab === "description" && (
                  <GameDescription
                    gameName={game.name}
                    description={game.description}
                  />
                )}
                {activeTab === "faq" && <FAQSection items={gameContent?.faq} />}
                {activeTab === "reviews" && (
                  <ReviewsSection
                    reviews={
                      gameContent?.reviews?.length
                        ? gameContent.reviews
                        : mockReviews
                    }
                    metadata={gameContent?.metadata || mockMetadata}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3">
          <OrderSummary
            game={game}
            selectedCurrency={selectedCurrency}
            appliedDiscount={appliedDiscount}
            couponInfo={couponInfo}
            isFormValid={isFormValid}
            userId={userId}
            serverId={serverId}
            onSubmit={handleSubmitOrder}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* JSON-LD Structure Data для SEO */}
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: `${product.name} Currency`,
              description:
                product.description || `Buy ${product.name} game currency`,
              image: product.image,
              brand: {
                "@type": "Brand",
                name: "DonVip",
              },
              offers: currencyOptions.map((option) => ({
                "@type": "Offer",
                price: option.price.toString().replace(/[^\d.]/g, ""),
                priceCurrency: currentCurrency?.code || "RUB",
                availability: "https://schema.org/InStock",
                seller: {
                  "@type": "Organization",
                  name: "DonVip",
                },
              })),
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "150",
                bestRating: "5",
                worstRating: "1",
              },
              provider: {
                "@type": "Organization",
                name: "DonVip",
                url: "https://don-vip.com",
              },
            }),
          }}
        />
      )}

      {mobileVersion}
      {desktopVersion}
      <GuestAuthPopup
        isOpen={showGuestAuthPopup}
        onClose={() => {
          setShowGuestAuthPopup(false);
        }}
        onSubmit={handleGuestAuthSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
