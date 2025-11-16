"use client";

import { PaymentMethodSelector } from "@/entities/payment/ui/payment-method-selector";
import { cn } from "@/shared/utils/cn";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle,
  Loader,
  Clock,
  User,
  Server,
} from "lucide-react";
import { Banner } from "./banner/banner";
import { OrderSummary } from "./order-summary/order-summary";
import { CustomTooltip } from "@/shared/ui/tooltip/tooltip";
import { CustomAlert } from "./alert/alert";
import QuestionIcon from "@/shared/icons/question-icon";
import { useValidateBigoUser } from "@/entities/bigo/hooks/use-validate-bigo";
import { useValidateUser } from "@/entities/user/hooks/use-validate-user";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useCreateOrder } from "@/entities/order/hooks/use-create-order";
import type { CreateOrderDto } from "@/entities/order/model/types";
import { useProductWithHardcoded } from "@/entities/product/hooks/queries/use-product-with-hardcoded";
import { OrderBlockSkeleton } from "./loading/skeleton-loading";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useGetMe } from "@/entities/auth/hooks/use-auth";
import { GuestAuthPopup } from "@/entities/order/ui/guest-user-popup";
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import { useOrderCookies } from "@/shared/hooks/use-order-cookies";
import { useTelegramMembership } from "@/shared/hooks/use-telegram-membership";

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
import { useDiamondPrice } from "@/entities/diamond-price/hooks/use-diamond-price";

interface OrderBlockProps {
  gameSlug: number;
  initialExpandInfo?: boolean;
  prefillData?: {
    userId?: string;
    serverId?: string;
    amount?: string;
  };
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
  prefillData,
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
  const { data: diamondPriceData } = useDiamondPrice(
    currentCurrency?.code || "RUB"
  );

  // Debug: проверяем данные о настройках алмазов
  useEffect(() => {
    if (diamondPriceData) {
      console.log("💎 Diamond Price Data для", currentCurrency?.code, ":", {
        custom_amount_enabled: diamondPriceData.custom_amount_enabled,
        price_per_diamond: diamondPriceData.price_per_diamond,
        currency: diamondPriceData.currency,
        is_active: diamondPriceData.is_active,
      });
      console.log(
        "🔘 Кнопка 'Свое значение' будет:",
        diamondPriceData.custom_amount_enabled ? "ПОКАЗАНА ✅" : "СКРЫТА ❌"
      );
    } else {
      console.log(
        "⚠️ Diamond Price Data не загружена, используется fallback (кнопка показана)"
      );
    }
  }, [diamondPriceData, currentCurrency?.code]);

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
  const [selectedPaymentMethod, setSelectedPaymentMethodState] = useState("");
  const [isMonetaPayment, setIsMonetaPayment] = useState(false);
  const [monetaMethodCode, setMonetaMethodCode] = useState<string | undefined>(
    undefined
  );
  const [isDukPayPayment, setIsDukPayPayment] = useState(false);
  const [dukPayMethodCode, setDukPayMethodCode] = useState<string | undefined>(
    undefined
  );
  const [isPay4GamePayment, setIsPay4GamePayment] = useState(false);
  const [pay4GameMethodCode, setPay4GameMethodCode] = useState<
    string | undefined
  >(undefined);

  // Обертка для логирования изменений способа оплаты - Memoized для предотвращения лишних рендеров
  const setSelectedPaymentMethod = useCallback(
    (
      method: string,
      isMoneta: boolean = false,
      code?: string,
      isDukPay: boolean = false,
      isPay4Game: boolean = false
    ) => {
      console.log("🔄 Payment method changed:", `"${method}"`, {
        isMoneta,
        isDukPay,
        isPay4Game,
        code,
        previousMethod: selectedPaymentMethod,
      });
      setSelectedPaymentMethodState(method);
      setIsMonetaPayment(isMoneta);
      setMonetaMethodCode(code);
      setIsDukPayPayment(isDukPay);
      setDukPayMethodCode(code);
      setIsPay4GamePayment(isPay4Game);
      setPay4GameMethodCode(code);
    },
    [selectedPaymentMethod]
  );

  const [showGuestAuthPopup, setShowGuestAuthPopup] = useState(false);
  const [guestIdentifier, setGuestIdentifier] = useState("");
  const [isUserIdValid, setIsUserIdValid] = useState(true); // Добавляем состояние для валидности User ID
  const [activeTab, setActiveTab] = useState<
    "instruction" | "reviews" | "description" | "faq"
  >("instruction");

  // Встроенные состояния для User ID формы
  const [userIdInput, setUserIdInput] = useState("");
  const [serverIdInput, setServerIdInput] = useState("");
  const [showSpaceWarning, setShowSpaceWarning] = useState(false);
  const [spaceWarningField, setSpaceWarningField] = useState<
    "userId" | "serverId"
  >("userId");
  const [showIdPrefixWarning, setShowIdPrefixWarning] = useState(false);
  const [showSpecialCharsWarning, setShowSpecialCharsWarning] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    username?: string;
    vipStatus?: string;
    errorMessage?: string;
  } | null>(null);
  const [hasValidated, setHasValidated] = useState(false);

  // Состояния для проверки Telegram канала
  const [telegramUsername, setTelegramUsername] = useState("");
  const [showTelegramCheck, setShowTelegramCheck] = useState(false);
  const [telegramMembershipValid, setTelegramMembershipValid] = useState(false);

  // Встроенные состояния для SavedAccountsQuickSelect
  const [isAccountsExpanded, setIsAccountsExpanded] = useState(false);

  // Hooks для валидации
  const {
    validateUser,
    isValidating,
    error: validationError,
  } = useValidateBigoUser();
  const {
    mutate: validateDonatbankUser,
    isPending: isValidatingDonatbank,
    error: donatbankValidationError,
  } = useValidateUser();

  // Debounced user ID for validation
  const debouncedUserId = useDebounce(userIdInput, 1000);

  // Telegram membership hook
  const {
    checkMembership,
    isLoading: isTelegramLoading,
    result: telegramResult,
  } = useTelegramMembership();

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

  // Обработчик для валидного ввода User ID - ОТКЛЮЧЕНА ПРОВЕРКА
  const handleUserIdValidation = (isValid: boolean) => {
    console.log("🔄 User ID validation changed:", isValid);
    // ВСЕГДА УСТАНАВЛИВАЕМ TRUE - УБИРАЕМ ПРОВЕРКУ ВАЛИДАЦИИ
    setIsUserIdValid(true);

    // Убираем автоматический переход к оплате после ввода ID
    // if (selectedAmount !== null && userId.trim() !== "") {
    //   // Для игр требующих сервер, проверяем что сервер ID тоже введен
    //   if (game?.isServerRequired && serverId.trim() === "") {
    //     return; // Не переходим если сервер ID не введен
    //   }
    //   scrollToPaymentSection();
    // }
  };

  // Функция для проверки участия в Telegram канале
  const handleTelegramCheck = async () => {
    if (!telegramUsername.trim()) return;

    try {
      const result = await checkMembership(telegramUsername);
      setTelegramMembershipValid(result.isMember);

      if (result.isMember) {
        console.log("✅ User is a member of the Telegram channel");
      } else {
        console.log("❌ User is not a member of the Telegram channel");
      }
    } catch (error) {
      console.error("Telegram check error:", error);
      setTelegramMembershipValid(false);
    }
  };

  // Встроенные функции для обработки User ID формы
  const isPubgMobile =
    product?.smile_api_game === "pubgmobile" ||
    product?.smile_api_game === "PUBG";
  const isDonatBank =
    product?.type === "DonatBank" ||
    product?.type === "Smile" ||
    (product?.smile_api_game && product?.type !== "Bigo" && !isPubgMobile);
  const isBigo = product?.type === "Bigo";
  const needsEmail = product?.requireEmail || isPubgMobile;
  const isServerRequired =
    product?.requireServer ||
    product?.isServerRequired ||
    game?.isServerRequired;

  const errorMessages = {
    en: {
      spaceWarning:
        "Spaces are not allowed and have been automatically removed.",
      idValid: "ID is valid",
      idNotFound: "ID not found",
      userNotFound: "User not found",
      username: "Username",
      validating: "Validating...",
    },
    ru: {
      spaceWarning: "Пробелы не допускаются и были автоматически удалены.",
      idValid: "ID действителен",
      idNotFound: "ID не найден",
      userNotFound: "Пользователь не найден",
      username: "Пользователь",
      validating: "Проверка...",
    },
  };

  const isEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const getTranslation = (key: keyof typeof errorMessages.en) => {
    if (locale === "ru") {
      return errorMessages.ru[key];
    }
    return errorMessages.en[key];
  };

  const handleSpaceDetection = (
    value: string,
    field: "userId" | "serverId"
  ) => {
    if (value.includes(" ")) {
      setSpaceWarningField(field);
      setShowSpaceWarning(true);
      return value.replace(/\s/g, ""); // Remove all spaces
    }
    return value;
  };

  const handleSpecialCharsDetection = (value: string) => {
    const allowedCharsRegex = isPubgMobile
      ? /^[a-zA-Z0-9._@-]*$/
      : /^[a-zA-Z0-9._]*$/;
    if (!allowedCharsRegex.test(value)) {
      setShowSpecialCharsWarning(true);
      const cleanValue = isPubgMobile
        ? value.replace(/[^a-zA-Z0-9._@-]/g, "")
        : value.replace(/[^a-zA-Z0-9._]/g, "");
      setTimeout(() => setShowSpecialCharsWarning(false), 3000);
      return cleanValue;
    }
    return value;
  };

  const handleUserIdInputChange = (value: string) => {
    // Валидация: запретить ввод "ID:" в начале или в любом месте
    if (value.toLowerCase().includes("id:")) {
      setShowIdPrefixWarning(true);
      value = value.replace(/id:/gi, "");
      setTimeout(() => setShowIdPrefixWarning(false), 3000);
    }

    const cleanValueFromSpecialChars = handleSpecialCharsDetection(value);
    const cleanValue = handleSpaceDetection(
      cleanValueFromSpecialChars,
      "userId"
    );
    setUserIdInput(cleanValue);
    setUserId(cleanValue); // Синхронизируем с основным состоянием

    // Сохраняем в localStorage
    if (cleanValue.trim() !== "") {
      localStorage.setItem("currentUserId", cleanValue.trim());
      console.log("💾 Saved to localStorage:", cleanValue.trim());
    } else {
      localStorage.removeItem("currentUserId");
      console.log("🗑️ Removed from localStorage");
    }

    // Save game data to cookies when user enters valid ID
    if (cleanValue.trim().length >= 4 && game?.id) {
      saveGameData({
        gameId: game.id,
        accountId: cleanValue.trim(),
        serverId: serverId || undefined,
        gameName: game.name,
        lastUsed: Date.now(),
      });
    }

    // Reset validation when ID changes
    if ((isBigo || isDonatBank) && hasValidated) {
      setHasValidated(false);
      setValidationResult(null);
      setIsUserIdValid(false);
    }

    // Убираем автоматический переход к оплате после ввода ID
    // if (cleanValue.trim().length >= 4 && selectedAmount !== null) {
    //   if (game?.isServerRequired && serverId.trim() === "") {
    //     return;
    //   }
    //   scrollToPaymentSection();
    // }
  };

  const handleServerIdInputChange = (value: string) => {
    if (value.toLowerCase().includes("id:")) {
      setShowIdPrefixWarning(true);
      value = value.replace(/id:/gi, "");
      setTimeout(() => setShowIdPrefixWarning(false), 3000);
    }

    const cleanValueFromSpecialChars = handleSpecialCharsDetection(value);
    const cleanValue = handleSpaceDetection(
      cleanValueFromSpecialChars,
      "serverId"
    );
    setServerIdInput(cleanValue);
    setServerId(cleanValue);

    // Reset validation when server ID changes
    if (isDonatBank && hasValidated) {
      setHasValidated(false);
      setValidationResult(null);
      setIsUserIdValid(false);
    }

    // Save game data to cookies when user enters server ID
    if (
      cleanValue.trim().length >= 1 &&
      userId.trim().length >= 4 &&
      game?.id
    ) {
      saveGameData({
        gameId: game.id,
        accountId: userId.trim(),
        serverId: cleanValue.trim(),
        gameName: game.name,
        lastUsed: Date.now(),
      });
    }
  };

  const handleValidateUserId = async (valueToValidate?: string) => {
    const targetValue = valueToValidate || userIdInput.trim();
    if (!targetValue) return;

    if (isBigo) {
      try {
        const result = await validateUser(targetValue);
        setValidationResult(result);
        setHasValidated(true);
        setIsUserIdValid(result.isValid);
      } catch (error) {
        const errorResult = {
          isValid: false,
          errorMessage:
            validationError ||
            (locale === "ru" ? "Ошибка валидации" : "Validation error"),
        };
        setValidationResult(errorResult);
        setHasValidated(true);
        setIsUserIdValid(false);
      }
      return;
    }

    if (isDonatBank && gameSlug) {
      try {
        validateDonatbankUser(
          { userId: targetValue, gameId: gameSlug, zoneId: serverId },
          {
            onSuccess: (result) => {
              const validationResultFormatted = {
                isValid: result.validated,
                username: result.nickname || undefined,
                errorMessage: result.validated ? undefined : result.message,
              };
              setValidationResult(validationResultFormatted);
              setHasValidated(true);
              setIsUserIdValid(result.validated);
            },
            onError: () => {
              const errorResult = {
                isValid: false,
                errorMessage:
                  locale === "ru"
                    ? "Ошибка валидации пользователя"
                    : "User validation error",
              };
              setValidationResult(errorResult);
              setHasValidated(true);
              setIsUserIdValid(false);
            },
          }
        );
      } catch (error) {
        console.error("Donatbank validation catch error:", error);
      }
    }
  };

  // Старые обработчики для совместимости
  const handleUserIdChange = (value: string) => {
    handleUserIdInputChange(value);
  };

  const handleServerIdChange = (value: string) => {
    handleServerIdInputChange(value);
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
  };

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
  } = useCreateOrder(
    selectedPaymentMethod,
    currentCurrency.code,
    isMonetaPayment,
    monetaMethodCode,
    isDukPayPayment,
    dukPayMethodCode,
    isPay4GamePayment,
    pay4GameMethodCode
  );

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

  // Автозаполнение формы данными из URL (prefillData)
  useEffect(() => {
    console.log("🔍 OrderBlock получил prefillData:", prefillData);
    if (prefillData) {
      if (prefillData.userId) {
        console.log("✅ Заполняем userId:", prefillData.userId);
        // Используем handleUserIdInputChange для правильной обработки
        handleUserIdInputChange(prefillData.userId);

        // Принудительно повторяем через небольшую задержку
        setTimeout(() => {
          console.log(
            "🔄 Принудительная установка userId:",
            prefillData.userId
          );
          handleUserIdInputChange(prefillData.userId || "");
        }, 200);

        // И еще раз через большую задержку на случай, если компонент еще не готов
        setTimeout(() => {
          console.log("🔄 Финальная установка userId:", prefillData.userId);
          handleUserIdInputChange(prefillData.userId || "");
        }, 500);
      }
      if (prefillData.serverId) {
        console.log("✅ Заполняем serverId:", prefillData.serverId);
        setServerIdInput(prefillData.serverId);
        setServerId(prefillData.serverId);

        // Принудительно повторяем через задержку
        setTimeout(() => {
          console.log("🔄 Повторная установка serverId:", prefillData.serverId);
          setServerIdInput(prefillData.serverId || "");
          setServerId(prefillData.serverId || "");
        }, 200);
      }
      if (prefillData.amount && currencyOptions.length > 0) {
        console.log("✅ Ищем пакет с amount:", prefillData.amount);
        // Найти пакет с соответствующим количеством
        const matchingPackage = currencyOptions.find(
          (pkg) => pkg.amount.toString() === prefillData.amount
        );
        if (matchingPackage) {
          console.log("✅ Найден пакет:", matchingPackage);
          setSelectedAmount(matchingPackage.id);

          // Принудительно устанавливаем выбранный пакет
          setTimeout(() => {
            console.log("🔄 Повторная установка пакета:", matchingPackage);
            setSelectedAmount(matchingPackage.id);
          }, 200);
        } else {
          console.log("❌ Пакет не найден для amount:", prefillData.amount);
        }
      }
    }
  }, [prefillData, currencyOptions]);
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
            isActive: item.isActive !== false, // Включаем поле isActive, по умолчанию true
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
              ![
                "price",
                "amount",
                "type",
                "sku",
                "discountPercent",
                "isActive",
              ].includes(key)
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

  // Инициализация из localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUserId = localStorage.getItem("currentUserId");
      if (currentUserId && currentUserId.trim() !== "") {
        console.log("🔄 Loading from localStorage:", currentUserId.trim());
        setUserIdInput(currentUserId.trim());
        setUserId(currentUserId.trim());
      }
    }
  }, []);

  // Валидация на основе debounced значения
  useEffect(() => {
    if (isBigo && debouncedUserId.trim().length >= 4) {
      handleValidateUserId(debouncedUserId.trim());
    } else if (isDonatBank && debouncedUserId.trim().length >= 4) {
      handleValidateUserId(debouncedUserId.trim());
    } else if (isPubgMobile) {
      const emailValid = isEmail(debouncedUserId);
      setValidationResult({
        isValid: emailValid,
        username: emailValid ? "Email format valid" : undefined,
        errorMessage: emailValid ? undefined : "Invalid email format",
      });
      setHasValidated(true);
      setIsUserIdValid(emailValid);
    } else if ((isBigo || isDonatBank) && debouncedUserId.trim().length < 4) {
      setHasValidated(false);
      setValidationResult(null);
      setIsUserIdValid(false);
    }
  }, [
    debouncedUserId,
    serverIdInput,
    isBigo,
    isPubgMobile,
    isDonatBank,
    gameSlug,
  ]);

  // Обработка валидации для всех типов продуктов
  useEffect(() => {
    if (isBigo || isDonatBank) {
      const isValidLength = userIdInput.trim().length >= 4;
      if (isValidLength) {
        setHasValidated(true);
        setValidationResult({
          isValid: true,
          username: userIdInput.trim(),
          errorMessage: undefined,
        });
      } else {
        setHasValidated(false);
        setValidationResult(null);
      }
      setIsUserIdValid(isValidLength);
    } else if (isPubgMobile) {
      const emailValid = isEmail(userIdInput);
      setIsUserIdValid(emailValid);
    } else {
      const isValidLength = userIdInput.trim().length >= 4;
      setIsUserIdValid(isValidLength);
    }
  }, [userIdInput, isBigo, isDonatBank, isPubgMobile]);

  // Периодическая синхронизация с localStorage
  useEffect(() => {
    const syncWithLocalStorage = () => {
      if (typeof window !== "undefined") {
        const currentUserId = localStorage.getItem("currentUserId") || "";
        const currentInputValue = userIdInput.trim();
        if (currentUserId !== currentInputValue) {
          console.log("🔄 Sync: localStorage -> input:", {
            localStorage: `"${currentUserId}"`,
            input: `"${currentInputValue}"`,
          });
          setUserIdInput(currentUserId);
          setUserId(currentUserId);
        }
      }
    };
    const interval = setInterval(syncWithLocalStorage, 100);
    return () => clearInterval(interval);
  }, [userIdInput]);

  // Автоматически выбираем метод оплаты по умолчанию
  useEffect(() => {
    if (!selectedPaymentMethod && currentCurrency) {
      console.log(
        "🔄 Auto-selecting default payment method for currency:",
        currentCurrency.code
      );
      if (currentCurrency.code === "RUB") {
        // Не выбираем автоматически, пусть пользователь выбирает сам
        // из всех доступных методов (включая несколько SBP)
        console.log("💡 Letting user choose from all available RUB methods");
      } else {
        setSelectedPaymentMethod("paypal"); // Для других валют Paypal
      }
    }
  }, [selectedPaymentMethod, currentCurrency]);

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

  // Детальная проверка каждого условия валидности формы
  const packageSelected = selectedCurrency !== null;
  const customAmountValid =
    isCustomAmountSelected && customAmount !== null && customPrice !== null;
  const amountSelectionValid = packageSelected || customAmountValid;
  // Проверяем, что User ID не пустой
  const userIdFilled = userId.trim() !== "";
  const serverIdValid = !game.isServerRequired || serverId.trim() !== "";
  // Проверяем валидность User ID
  const userIdValidationPassed = isUserIdValid;
  const paymentMethodSelected =
    selectedPaymentMethod !== null && selectedPaymentMethod !== "";

  const isFormValid =
    amountSelectionValid &&
    userIdFilled &&
    serverIdValid &&
    userIdValidationPassed &&
    paymentMethodSelected;
  // Telegram проверка опциональна, не блокирует заказ

  // ДЕТАЛЬНЫЕ ЛОГИ ВАЛИДАЦИИ ФОРМЫ
  console.log("=== FORM VALIDATION DEBUG ===");
  console.log("1. Amount Selection:", {
    packageSelected,
    selectedCurrency,
    customAmountValid,
    isCustomAmountSelected,
    customAmount,
    customPrice,
    result: amountSelectionValid,
    status: amountSelectionValid ? "✅ VALID" : "❌ INVALID",
  });

  console.log("2. User ID:", {
    userId: `"${userId}"`,
    trimmed: `"${userId.trim()}"`,
    length: userId.trim().length,
    result: userIdFilled,
    status: userIdFilled ? "✅ VALID" : "❌ INVALID",
  });

  console.log("3. Server ID:", {
    isServerRequired: game.isServerRequired,
    serverId: `"${serverId}"`,
    trimmed: `"${serverId.trim()}"`,
    length: serverId.trim().length,
    result: serverIdValid,
    status: serverIdValid ? "✅ VALID" : "❌ INVALID",
  });

  console.log("4. User ID Validation:", {
    isUserIdValid,
    userIdValidationPassed,
    status: userIdValidationPassed ? "✅ VALID" : "❌ INVALID",
  });

  console.log("5. Payment Method:", {
    selectedPaymentMethod: `"${selectedPaymentMethod}"`,
    isNotNull: selectedPaymentMethod !== null,
    isNotEmpty: selectedPaymentMethod !== "",
    result: paymentMethodSelected,
    status: paymentMethodSelected ? "✅ VALID" : "❌ INVALID",
  });

  console.log("🔥 FINAL FORM STATE:", {
    isFormValid,
    status: isFormValid
      ? "✅ FORM VALID - BUTTON ENABLED"
      : "❌ FORM INVALID - BUTTON DISABLED",
    failedChecks: [
      !amountSelectionValid && "Amount/Package not selected",
      !userIdFilled && "User ID empty",
      !serverIdValid && "Server ID required but empty",
      !userIdValidationPassed && "User ID validation failed",
      !paymentMethodSelected && "Payment method not selected",
    ].filter(Boolean),
  });
  console.log("=== END VALIDATION DEBUG ===");

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
    console.log("🔄 Package selected:", packageId);
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

  const submitOrderWithIdentifier = async (identifier: string) => {
    if (!isFormValid || !selectedCurrency) {
      setError("Please fill in all required fields");
      return;
    }

    // Calculate prices for both RUB and converted currency
    let originalPriceRub = selectedCurrency.originalPriceRub;

    // ПРИМЕНЯЕМ СКИДКУ ПАКЕТА ЕСЛИ ЕСТЬ
    if (
      selectedCurrency.discountPercent &&
      selectedCurrency.discountPercent > 0
    ) {
      const packageDiscountAmount =
        (originalPriceRub * selectedCurrency.discountPercent) / 100;
      originalPriceRub = Math.max(0, originalPriceRub - packageDiscountAmount);
      console.log("🎯 Package discount applied:", {
        originalPrice: selectedCurrency.originalPriceRub,
        discountPercent: selectedCurrency.discountPercent,
        discountAmount: packageDiscountAmount,
        priceAfterDiscount: originalPriceRub,
      });
    }

    // ПРИМЕНЯЕМ TELEGRAM СКИДКУ 5% (только для пакетов до 300 единиц И если еще не использовалась)
    let telegramDiscountAmount = 0;
    const canUseTelegramDiscount =
      telegramMembershipValid &&
      selectedCurrency.amount <= 300 &&
      !me?.telegram_discount_used;

    if (canUseTelegramDiscount) {
      telegramDiscountAmount = (originalPriceRub * 5) / 100; // 5% скидка
      originalPriceRub = Math.max(0, originalPriceRub - telegramDiscountAmount);
      console.log("📱 Telegram discount applied (5%) - FIRST TIME USE:", {
        amount: selectedCurrency.amount,
        discountAmount: telegramDiscountAmount,
        priceAfterTelegramDiscount: originalPriceRub,
      });
    } else if (me?.telegram_discount_used) {
      console.log(
        "📱 Telegram discount NOT applied - already used by this user"
      );
    }

    // ПРИМЕНЯЕМ РЕФЕРАЛЬНУЮ СКИДКУ (индивидуальная для каждого пользователя)
    let referralDiscountAmount = 0;
    const userReferralDiscount = me?.referral_discount
      ? Number(me.referral_discount)
      : 0;
    if (userReferralDiscount > 0) {
      referralDiscountAmount = (originalPriceRub * userReferralDiscount) / 100;
      originalPriceRub = Math.max(0, originalPriceRub - referralDiscountAmount);
      console.log("🎁 Referral discount applied:", {
        discountPercent: userReferralDiscount,
        discountAmount: referralDiscountAmount,
        priceAfterReferralDiscount: originalPriceRub,
      });
    }

    const originalPriceConverted =
      currentCurrency.code === "RUB"
        ? originalPriceRub
        : originalPriceRub * currentCurrency.rate;

    // Calculate ADDITIONAL coupon discount in RUB (применяется поверх скидки пакета и telegram)
    const couponDiscountAmountRub =
      couponInfo?.type === "percentage"
        ? (originalPriceRub * appliedDiscount) / 100
        : appliedDiscount;

    // Calculate final prices
    const finalPriceRub = Math.max(
      0,
      originalPriceRub - couponDiscountAmountRub
    );
    const finalPriceConverted =
      currentCurrency.code === "RUB"
        ? finalPriceRub
        : finalPriceRub * currentCurrency.rate;

    // Use converted price for the order (what the user actually pays)
    const formattedPrice = finalPriceConverted.toFixed(2);

    console.log("💰 Final price calculation:", {
      originalPriceRub: selectedCurrency.originalPriceRub,
      packageDiscountPercent: selectedCurrency.discountPercent,
      telegramDiscount: telegramDiscountAmount,
      priceAfterPackageAndTelegram: originalPriceRub,
      couponDiscount: couponDiscountAmountRub,
      finalPriceRub,
      finalPriceConverted,
      formattedPrice,
      currency: currentCurrency.code,
      summary: `User will pay: ${formattedPrice} ${currentCurrency.code}`,
    });

    // Извлекаем правильный код метода оплаты для API
    // Если ID содержит суффикс провайдера, используем оригинальный код
    const getPaymentMethodForApi = (methodId: string): string => {
      // Убираем суффиксы провайдеров и внутренние ID
      let cleanMethod = methodId;

      // Убираем суффиксы провайдеров
      cleanMethod = cleanMethod.replace(/_pay4game$/, "");
      cleanMethod = cleanMethod.replace(/_dukpay$/, "");
      cleanMethod = cleanMethod.replace(/_moneta$/, "");

      // Убираем внутренние ID (все после последнего подчеркивания, если это число)
      const parts = cleanMethod.split("_");
      if (parts.length > 1) {
        const lastPart = parts[parts.length - 1];
        if (/^\d+$/.test(lastPart)) {
          // Последняя часть - число, убираем её
          cleanMethod = parts.slice(0, -1).join("_");
        }
      }

      console.log(
        `🔄 Payment method conversion: "${methodId}" -> "${cleanMethod}"`
      );
      return cleanMethod;
    };

    const paymentMethodForApi = getPaymentMethodForApi(selectedPaymentMethod);

    const orderData: CreateOrderDto = {
      identifier: identifier,
      game_id: game.id,
      user_id: userIdDB,
      currency_id: selectedCurrency.id,
      amount: selectedCurrency.amount,
      price: formattedPrice, // ✅ ФИНАЛЬНАЯ ЦЕНА СО ВСЕМИ СКИДКАМИ
      payment_method: paymentMethodForApi,
      user_game_id: !userId || userId.trim() === "" ? "unknown" : userId,
      server_id: game.isServerRequired ? serverId : undefined,
      coupon_code: couponInfo?.code || undefined,

      // Discount information for admin panel
      original_price: selectedCurrency.originalPriceRub,
      package_discount: selectedCurrency.discountPercent || 0,
      telegram_discount: canUseTelegramDiscount ? 5 : 0,
      has_telegram_discount: canUseTelegramDiscount, // ✅ Флаг что применена скидка из Telegram
      referral_discount: userReferralDiscount,
      coupon_discount: couponDiscountAmountRub,
      final_price: finalPriceRub,
      currency: currentCurrency.code,
    };

    console.log("📦 Creating order with data:", {
      ...orderData,
      note: "Price includes ALL discounts (package + telegram + referral + coupon)",
      telegramDiscountUsed: me?.telegram_discount_used,
    });

    try {
      const response = await createOrder(orderData);

      if (paymentMethodForApi === "tbank" && currentCurrency.code === "RUB") {
        // Формируем название пакета для чека
        const priceInRub = Math.round(finalPriceRub); // Округляем до целого числа
        let packageName: string;

        // Проверяем асинхронно, является ли цена дизайнерской услугой
        const isDesignService = await isDesignServicePrice(priceInRub);

        if (isDesignService) {
          // Если цена соответствует дизайнерской услуге, используем её название
          packageName = await getDesignServiceNameByPrice(priceInRub, locale);
        } else {
          // Иначе используем стандартное название с количеством и валютой
          packageName = `${selectedCurrency.amount} ${
            game.currencyName || "Diamonds"
          }`;
        }

        const params = new URLSearchParams({
          orderId: response.id.toString(),
          amount: selectedCurrency.amount.toString(),
          price: formattedPrice, // ✅ ФИНАЛЬНАЯ ЦЕНА СО ВСЕМИ СКИДКАМИ
          currencyName: game.currencyName || "Diamonds",
          gameName: game.name,
          packageName: packageName,
          userId: userId,
          userIdDB: userIdDB,
          serverId: game.isServerRequired ? serverId : "",
        });

        console.log("🏦 Redirecting to T-Bank with params:", {
          orderId: response.id,
          price: formattedPrice,
          note: "User will pay this exact amount (with all discounts applied)",
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
    } catch (err) {
      console.error("❌ Order creation failed:", err);
      setError("Failed to create order. Please try again.");
    }
  };

  const handleSubmitOrder = async () => {
    console.log("=== handleSubmitOrder clicked ===");
    console.log("isFormValid:", isFormValid);
    console.log("selectedCurrency:", selectedCurrency);
    console.log("selectedPaymentMethod:", selectedPaymentMethod);

    setError("");

    if (!isFormValid || !selectedCurrency) {
      console.log("Form validation FAILED");
      setError("Please fill in all required fields");
      return;
    }

    console.log("Form validation PASSED, proceeding...");

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

    await submitOrderWithIdentifier(finalIdentifier);
  };

  const handleGuestAuthSubmit = async (identifier: string) => {
    setGuestIdentifier(identifier);
    setShowGuestAuthPopup(false);
    identifierCollected.current = true;

    // Submit the order with the collected identifier
    await submitOrderWithIdentifier(identifier);
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

      {/* Telegram Subscription Check - Mobile */}
      <div className="px-4 mb-4">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div
            className={`flex items-center justify-between ${
              showTelegramCheck ? "mb-3" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-medium">
                {locale === "ru"
                  ? "Проверка подписки в Telegram"
                  : "Telegram Channel Subscription Check"}
              </span>
              {telegramMembershipValid && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
            <button
              onClick={() => setShowTelegramCheck(!showTelegramCheck)}
              className="px-3 py-1.5 border-2 border-blue-600 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-colors"
            >
              {showTelegramCheck
                ? locale === "ru"
                  ? "Скрыть"
                  : "Hide"
                : locale === "ru"
                ? "Сделать"
                : "Check"}
            </button>
          </div>

          {showTelegramCheck && (
            <div className="space-y-3 mt-3">
              {/* Инструкция */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {locale === "ru"
                    ? "Как получить скидку 5%:"
                    : "How to get 5% discount:"}
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 min-w-[20px]">
                      1.
                    </span>
                    <div>
                      {locale === "ru"
                        ? "Подпишитесь на канал "
                        : "Subscribe to channel "}
                      <a
                        href="https://t.me/DON_VIPCOM"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        @DON_VIPCOM
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 min-w-[20px]">
                      2.
                    </span>
                    <div>
                      {locale === "ru" ? "Откройте бота " : "Open the bot "}
                      <a
                        href="https://t.me/DonVip_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        @DonVip_bot
                      </a>
                      {locale === "ru"
                        ? " и отправьте команду /start"
                        : " and send /start command"}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 min-w-[20px]">
                      3.
                    </span>
                    <div>
                      {locale === "ru"
                        ? "Введите ваш Telegram username ниже"
                        : "Enter your Telegram username below"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-700 mb-2">
                {locale === "ru"
                  ? "Введите ваш Telegram username:"
                  : "Enter your Telegram username:"}
              </div>

              {/* Предупреждение если юзер уже проверял членство */}
              {me?.telegram_membership_checked && (
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center text-yellow-700">
                    <span className="font-medium">
                      {locale === "ru"
                        ? "⚠️ Вы уже использовали эту проверку"
                        : "⚠️ You already used this check"}
                    </span>
                  </div>
                </div>
              )}

              <input
                type="text"
                placeholder={
                  locale === "ru"
                    ? "@ваш_telegram_username"
                    : "@your_telegram_username"
                }
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                disabled={me?.telegram_membership_checked}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleTelegramCheck}
                disabled={
                  !telegramUsername.trim() ||
                  isTelegramLoading ||
                  me?.telegram_membership_checked
                }
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                {isTelegramLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {locale === "ru" ? "Проверяем..." : "Checking..."}
                  </>
                ) : locale === "ru" ? (
                  "Проверить"
                ) : (
                  "Check"
                )}
              </button>

              {/* Результат проверки */}
              {telegramResult && (
                <div
                  className={`p-3 rounded-lg ${
                    telegramResult.alreadyChecked
                      ? "bg-yellow-50 border border-yellow-200"
                      : telegramResult.isMember
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      telegramResult.alreadyChecked
                        ? "text-yellow-700"
                        : telegramResult.isMember
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    <span className="font-medium">
                      {telegramResult.alreadyChecked
                        ? locale === "ru"
                          ? "⚠️ Вы уже использовали эту проверку"
                          : "⚠️ You already used this check"
                        : telegramResult.isMember
                        ? locale === "ru"
                          ? "Вы подписаны на канал! Скидка 5% будет применена к пакетам до 500 единиц."
                          : "You are subscribed to the channel! 5% discount will be applied to packages up to 500 units."
                        : locale === "ru"
                        ? "Вы не подписаны на канал. Подпишитесь для получения скидки 5%."
                        : "You are not subscribed to the channel. Subscribe to get 5% discount."}
                    </span>
                  </div>
                </div>
              )}

              <div className="text-xs text-blue-600">
                {locale === "ru"
                  ? "Подсказка: Убедитесь что ваш профиль Telegram не скрыт от поиска"
                  : "Tip: Make sure your Telegram profile is not hidden from search"}
              </div>
            </div>
          )}
        </div>
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
        showCustomAmountButton={false}
      />
      {/* test */}
      {/* Custom Amount Selector for mobile */}
      {showCustomAmountSelector && (
        <CustomAmountSelector
          packages={currencyOptions}
          onCustomAmountSelect={handleCustomAmountSelect}
          currencyName={game?.currencyName || currentCurrency.code}
          currencyImage={game.currencyImage}
          isActive={isCustomAmountSelected}
          onReset={handleCustomAmountReset}
        />
      )}

      <div data-step="user-id" className="px-4 md:px-0">
        {/* Saved Accounts Quick Select */}
        {/* Встроенный SavedAccountsQuickSelect */}
        {(() => {
          const savedAccounts =
            typeof window !== "undefined"
              ? JSON.parse(
                  localStorage.getItem("savedAccounts") || "[]"
                ).filter((account: any) => account.gameId === game.id)
              : [];

          if (savedAccounts.length === 0) return null;

          const visibleAccounts = isAccountsExpanded
            ? savedAccounts
            : savedAccounts.slice(0, 3);

          return (
            <div className="bg-gray-800/30 rounded-lg p-4 mb-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300 font-medium">
                  {locale === "ru" ? "Недавние аккаунты" : "Recent Accounts"}
                </span>
              </div>

              <div className="grid gap-2">
                {visibleAccounts.map((account: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          ID: {account.userId}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Server className="w-3 h-3" />
                          {locale === "ru" ? "Сервер" : "Server"}:{" "}
                          {account.serverId || "N/A"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleSavedAccountSelect(account);
                      }}
                      className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                    >
                      {locale === "ru" ? "Выбрать" : "Select"}
                    </button>
                  </div>
                ))}
              </div>

              {savedAccounts.length > 3 && (
                <button
                  onClick={() => setIsAccountsExpanded(!isAccountsExpanded)}
                  className="w-full mt-3 px-3 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
                >
                  {isAccountsExpanded
                    ? locale === "ru"
                      ? "Скрыть"
                      : "Hide"
                    : `${locale === "ru" ? "Показать все" : "Show all"} (${
                        savedAccounts.length
                      })`}
                </button>
              )}
            </div>
          );
        })()}

        {/* Встроенная User ID форма */}
        <div className="">
          <div className="flex items-center mt-4 mb-4">
            <h2 className="text-base md:text-lg font-bold text-gray-800">
              2.{" "}
              {needsEmail
                ? isServerRequired
                  ? locale === "ru"
                    ? "Введите ваш Email и ID сервера"
                    : "Enter your Email and Server ID"
                  : locale === "ru"
                  ? "Введите ваш Email"
                  : "Enter your Email"
                : isServerRequired
                ? t("user.enterIdAndServer")
                : product?.requireUID
                ? locale === "ru"
                  ? "Введите ваш User ID и UID"
                  : "Enter your User ID and UID"
                : t("user.enterIdNoPrefix")}
            </h2>
            <CustomTooltip
              content={
                <div className="p-1">
                  {isServerRequired
                    ? t("user.tooltipTextWithServer", {
                        defaultValue:
                          "Enter your user ID and server ID to proceed with the order. Both fields are required for proper identification.",
                      })
                    : t("user.tooltipTextWithoutServer", {
                        defaultValue:
                          "Enter your user ID to proceed with the order. Make sure to provide the correct ID as shown in the instructions below.",
                      })}
                </div>
              }
              position="top"
              delay={300}
            >
              <QuestionIcon className="ml-2" />
            </CustomTooltip>
          </div>
          <div className="space-y-3">
            {!isServerRequired && (
              <div className="relative">
                {!needsEmail && (
                  <div className="absolute left-3 font-roboto font-black text-black text-[13px] top-1/2 transform -translate-y-1/2 text-sm">
                    {t("user.idPrefix")}
                  </div>
                )}
                <input
                  type={needsEmail ? "email" : "text"}
                  placeholder={
                    needsEmail
                      ? t("user.userEmailPlaceholder")
                      : t("user.userIdPlaceholder")
                  }
                  value={userIdInput}
                  onChange={(e) => {
                    console.log("🎯 Input onChange triggered:", e.target.value);
                    handleUserIdInputChange(e.target.value);
                  }}
                  className={`w-full p-3 ${needsEmail ? "pl-3" : "pl-10"} ${
                    isBigo || isDonatBank ? "pr-10" : ""
                  } border rounded-lg ${
                    hasValidated && validationResult
                      ? validationResult.isValid
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {(isBigo || isDonatBank) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {(isValidating || isValidatingDonatbank) && (
                      <div className="flex items-center">
                        <Loader className="w-5 h-5 animate-spin text-blue-500" />
                        <span className="ml-1 text-xs text-blue-500">
                          {getTranslation("validating")}
                        </span>
                      </div>
                    )}
                    {hasValidated &&
                      validationResult &&
                      !(isValidating || isValidatingDonatbank) && (
                        <>
                          {validationResult.isValid ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                        </>
                      )}
                  </div>
                )}
              </div>
            )}

            {isServerRequired ? (
              <>
                <div className="relative">
                  <input
                    type={needsEmail ? "email" : "text"}
                    placeholder={
                      needsEmail
                        ? t("user.userEmailPlaceholder")
                        : t("user.userIdPlaceholder")
                    }
                    value={userIdInput}
                    onChange={(e) => handleUserIdInputChange(e.target.value)}
                    className={`w-full p-3 ${
                      isBigo || isDonatBank ? "pr-10" : ""
                    } border rounded-lg ${
                      hasValidated && validationResult
                        ? validationResult.isValid
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  {(isBigo || isDonatBank) && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {(isValidating || isValidatingDonatbank) && (
                        <div className="flex items-center">
                          <Loader className="w-5 h-5 animate-spin text-blue-500" />
                          <span className="ml-1 text-xs text-blue-500">
                            {getTranslation("validating")}
                          </span>
                        </div>
                      )}
                      {hasValidated &&
                        validationResult &&
                        !(isValidating || isValidatingDonatbank) && (
                          <>
                            {validationResult.isValid ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                            )}
                          </>
                        )}
                    </div>
                  )}
                </div>
                <div className="relative">
                  {isPubgMobile ? (
                    <select
                      value={serverIdInput}
                      onChange={(e) =>
                        handleServerIdInputChange(e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                    >
                      <option value="">
                        {t("user.selectServer") || "Выберите сервер"}
                      </option>
                      <option value="Asia">Asia</option>
                      <option value="Europe">Europe</option>
                      <option value="North America">North America</option>
                      <option value="South America">South America</option>
                      <option value="Middle East">Middle East</option>
                      <option value="Korea/Japan">Korea/Japan</option>
                    </select>
                  ) : (
                    <>
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        (
                      </div>
                      <input
                        type="text"
                        placeholder={t("user.userServerPlaceholder")}
                        value={serverIdInput}
                        onChange={(e) =>
                          handleServerIdInputChange(e.target.value)
                        }
                        className="w-full p-3 px-8 border border-gray-200 rounded-lg text-center"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        )
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : null}
          </div>

          {/* Validation Result */}
          {(isBigo || isDonatBank || isPubgMobile) &&
            hasValidated &&
            validationResult && (
              <div
                className={`mt-3 p-3 rounded-lg border ${
                  validationResult.isValid
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div
                  className={`flex items-center ${
                    validationResult.isValid ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {validationResult.isValid ? (
                    <CheckCircle size={16} className="mr-2" />
                  ) : (
                    <AlertTriangle size={16} className="mr-2" />
                  )}
                  <span className="font-medium">
                    {validationResult.isValid
                      ? getTranslation("idValid")
                      : getTranslation("idNotFound")}
                  </span>
                </div>
                {!validationResult.isValid && validationResult.errorMessage && (
                  <div className="mt-1 text-sm text-red-600">
                    {isPubgMobile
                      ? validationResult.errorMessage
                      : getTranslation("userNotFound")}
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
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
            isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
          )}
          disabled={!isFormValid || isLoading}
          onClick={() => {
            console.log("🔥 BUTTON CLICKED - Current state:", {
              isFormValid,
              isLoading,
              disabled: !isFormValid || isLoading,
            });
            handleSubmitOrder();
          }}
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

              {/* Telegram Subscription Check - Desktop */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div
                  className={`flex items-center justify-between ${
                    showTelegramCheck ? "mb-3" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-medium">
                      {locale === "ru"
                        ? "Проверка подписки в Telegram"
                        : "Telegram Channel Subscription Check"}
                    </span>
                    {telegramMembershipValid && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <button
                    onClick={() => setShowTelegramCheck(!showTelegramCheck)}
                    className="px-3 py-1.5 border-2 border-blue-600 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-colors"
                  >
                    {showTelegramCheck
                      ? locale === "ru"
                        ? "Скрыть"
                        : "Hide"
                      : locale === "ru"
                      ? "Сделать"
                      : "Check"}
                  </button>
                </div>

                {showTelegramCheck && (
                  <div className="space-y-3">
                    {/* Инструкция */}
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {locale === "ru"
                          ? "Как получить скидку 5%:"
                          : "How to get 5% discount:"}
                      </h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-blue-600 min-w-[20px]">
                            1.
                          </span>
                          <div>
                            {locale === "ru"
                              ? "Подпишитесь на канал "
                              : "Subscribe to channel "}
                            <a
                              href="https://t.me/DON_VIPCOM"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              @DON_VIPCOM
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-blue-600 min-w-[20px]">
                            2.
                          </span>
                          <div>
                            {locale === "ru"
                              ? "Откройте бота "
                              : "Open the bot "}
                            <a
                              href="https://t.me/DonVip_bot"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              @DonVip_bot
                            </a>
                            {locale === "ru"
                              ? " и отправьте команду /start"
                              : " and send /start command"}
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-blue-600 min-w-[20px]">
                            3.
                          </span>
                          <div>
                            {locale === "ru"
                              ? "Введите ваш Telegram username ниже"
                              : "Enter your Telegram username below"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-blue-700 mb-2">
                      {locale === "ru"
                        ? "Введите ваш Telegram username:"
                        : "Enter your Telegram username:"}
                    </div>

                    {/* Предупреждение если юзер уже проверял членство */}
                    {me?.telegram_membership_checked && (
                      <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 mb-2">
                        <div className="flex items-center text-yellow-700">
                          <span className="font-medium">
                            {locale === "ru"
                              ? "⚠️ Вы уже использовали эту проверку"
                              : "⚠️ You already used this check"}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={
                          locale === "ru"
                            ? "@ваш_telegram_username"
                            : "@your_telegram_username"
                        }
                        value={telegramUsername}
                        onChange={(e) => setTelegramUsername(e.target.value)}
                        disabled={me?.telegram_membership_checked}
                        className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        onClick={handleTelegramCheck}
                        disabled={
                          !telegramUsername.trim() ||
                          isTelegramLoading ||
                          me?.telegram_membership_checked
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isTelegramLoading ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            {locale === "ru" ? "Проверяем..." : "Checking..."}
                          </>
                        ) : locale === "ru" ? (
                          "Проверить"
                        ) : (
                          "Check"
                        )}
                      </button>
                    </div>

                    {/* Результат проверки */}
                    {telegramResult && (
                      <div
                        className={`p-3 rounded-lg ${
                          telegramResult.alreadyChecked
                            ? "bg-yellow-50 border border-yellow-200"
                            : telegramResult.isMember
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div
                          className={`flex items-center ${
                            telegramResult.alreadyChecked
                              ? "text-yellow-700"
                              : telegramResult.isMember
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {telegramResult.alreadyChecked ? (
                            <AlertTriangle size={16} className="mr-2" />
                          ) : telegramResult.isMember ? (
                            <CheckCircle size={16} className="mr-2" />
                          ) : (
                            <AlertTriangle size={16} className="mr-2" />
                          )}
                          <span className="font-medium">
                            {telegramResult.alreadyChecked
                              ? locale === "ru"
                                ? "⚠️ Вы уже использовали эту проверку"
                                : "⚠️ You already used this check"
                              : telegramResult.isMember
                              ? locale === "ru"
                                ? "Вы подписаны на канал! Скидка 5% будет применена к пакетам до 500 единиц."
                                : "You are subscribed to the channel! 5% discount will be applied to packages up to 500 units."
                              : locale === "ru"
                              ? "Вы не подписаны на канал. Подпишитесь для получения скидки 5%."
                              : "You are not subscribed to the channel. Subscribe to get 5% discount."}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-blue-600">
                      {locale === "ru"
                        ? "Подсказка: Убедитесь что ваш профиль Telegram не скрыт от поиска"
                        : "Tip: Make sure your Telegram profile is not hidden from search"}
                    </div>
                  </div>
                )}
              </div>

              <DiamondPackages
                packages={currencyOptions}
                onSelect={handlePackageSelect}
                selectedId={selectedAmount}
                currencyName={currentCurrency.code}
                currencyImage={game.currencyImage}
                productId={gameSlug}
                onCustomAmountClick={handleCustomAmountShow}
                showCustomAmountButton={false}
              />

              {/* Custom Amount Selector for desktop */}
              {showCustomAmountSelector && (
                <div className="mt-6">
                  <CustomAmountSelector
                    packages={currencyOptions}
                    onCustomAmountSelect={handleCustomAmountSelect}
                    currencyName={game?.currencyName || currentCurrency.code}
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
              {/* Встроенный SavedAccountsQuickSelect для Desktop */}
              {(() => {
                const savedAccounts =
                  typeof window !== "undefined"
                    ? JSON.parse(
                        localStorage.getItem("savedAccounts") || "[]"
                      ).filter((account: any) => account.gameId === game.id)
                    : [];

                if (savedAccounts.length === 0) return null;

                const visibleAccounts = isAccountsExpanded
                  ? savedAccounts
                  : savedAccounts.slice(0, 3);

                return (
                  <div className="bg-gray-800/30 rounded-lg p-6 mb-6 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300 font-medium">
                        {locale === "ru"
                          ? "Недавние аккаунты"
                          : "Recent Accounts"}
                      </span>
                    </div>

                    <div className="grid gap-3">
                      {visibleAccounts.map((account: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                              <User className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-white mb-1">
                                ID: {account.userId}
                              </div>
                              <div className="text-sm text-gray-400 flex items-center gap-1">
                                <Server className="w-4 h-4" />
                                {locale === "ru" ? "Сервер" : "Server"}:{" "}
                                {account.serverId || "N/A"}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              handleSavedAccountSelect(account);
                            }}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                          >
                            {locale === "ru" ? "Выбрать" : "Select"}
                          </button>
                        </div>
                      ))}
                    </div>

                    {savedAccounts.length > 3 && (
                      <button
                        onClick={() =>
                          setIsAccountsExpanded(!isAccountsExpanded)
                        }
                        className="w-full mt-4 px-4 py-3 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
                      >
                        {isAccountsExpanded
                          ? locale === "ru"
                            ? "Скрыть"
                            : "Hide"
                          : `${
                              locale === "ru" ? "Показать все" : "Show all"
                            } (${savedAccounts.length})`}
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Встроенная User ID форма */}
              <div className="">
                <div className="flex items-center mt-4 mb-4">
                  <h2 className="text-base md:text-lg font-bold text-gray-800">
                    2.{" "}
                    {needsEmail
                      ? isServerRequired
                        ? locale === "ru"
                          ? "Введите ваш Email и ID сервера"
                          : "Enter your Email and Server ID"
                        : locale === "ru"
                        ? "Введите ваш Email"
                        : "Enter your Email"
                      : isServerRequired
                      ? t("user.enterIdAndServer")
                      : product?.requireUID
                      ? locale === "ru"
                        ? "Введите ваш User ID и UID"
                        : "Enter your User ID and UID"
                      : t("user.enterIdNoPrefix")}
                  </h2>
                  <CustomTooltip
                    content={
                      <div className="p-1">
                        {isServerRequired
                          ? t("user.tooltipTextWithServer", {
                              defaultValue:
                                "Enter your user ID and server ID to proceed with the order. Both fields are required for proper identification.",
                            })
                          : t("user.tooltipTextWithoutServer", {
                              defaultValue:
                                "Enter your user ID to proceed with the order. Make sure to provide the correct ID as shown in the instructions below.",
                            })}
                      </div>
                    }
                    position="top"
                    delay={300}
                  >
                    <QuestionIcon className="ml-2" />
                  </CustomTooltip>
                </div>
                <div className="space-y-3">
                  {!isServerRequired && (
                    <div className="relative">
                      {!needsEmail && (
                        <div className="absolute left-3 font-roboto font-black text-black text-[13px] top-1/2 transform -translate-y-1/2 text-sm">
                          {t("user.idPrefix")}
                        </div>
                      )}
                      <input
                        type={needsEmail ? "email" : "text"}
                        placeholder={
                          needsEmail
                            ? t("user.userEmailPlaceholder")
                            : t("user.userIdPlaceholder")
                        }
                        value={userIdInput}
                        onChange={(e) => {
                          console.log(
                            "🎯 Input onChange triggered:",
                            e.target.value
                          );
                          handleUserIdInputChange(e.target.value);
                        }}
                        className={`w-full p-3 ${
                          needsEmail ? "pl-3" : "pl-10"
                        } ${
                          isBigo || isDonatBank ? "pr-10" : ""
                        } border rounded-lg ${
                          hasValidated && validationResult
                            ? validationResult.isValid
                              ? "border-green-500 bg-green-50"
                              : "border-red-500 bg-red-50"
                            : "border-gray-200"
                        }`}
                      />
                      {(isBigo || isDonatBank) && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                          {(isValidating || isValidatingDonatbank) && (
                            <div className="flex items-center">
                              <Loader className="w-5 h-5 animate-spin text-blue-500" />
                              <span className="ml-1 text-xs text-blue-500">
                                {getTranslation("validating")}
                              </span>
                            </div>
                          )}
                          {hasValidated &&
                            validationResult &&
                            !(isValidating || isValidatingDonatbank) && (
                              <>
                                {validationResult.isValid ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-red-500" />
                                )}
                              </>
                            )}
                        </div>
                      )}
                    </div>
                  )}

                  {isServerRequired ? (
                    <>
                      <div className="relative">
                        <input
                          type={needsEmail ? "email" : "text"}
                          placeholder={
                            needsEmail
                              ? t("user.userEmailPlaceholder")
                              : t("user.userIdPlaceholder")
                          }
                          value={userIdInput}
                          onChange={(e) =>
                            handleUserIdInputChange(e.target.value)
                          }
                          className={`w-full p-3 ${
                            isBigo || isDonatBank ? "pr-10" : ""
                          } border rounded-lg ${
                            hasValidated && validationResult
                              ? validationResult.isValid
                                ? "border-green-500 bg-green-50"
                                : "border-red-500 bg-red-50"
                              : "border-gray-200"
                          }`}
                        />
                        {(isBigo || isDonatBank) && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                            {(isValidating || isValidatingDonatbank) && (
                              <div className="flex items-center">
                                <Loader className="w-5 h-5 animate-spin text-blue-500" />
                                <span className="ml-1 text-xs text-blue-500">
                                  {getTranslation("validating")}
                                </span>
                              </div>
                            )}
                            {hasValidated &&
                              validationResult &&
                              !(isValidating || isValidatingDonatbank) && (
                                <>
                                  {validationResult.isValid ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                  )}
                                </>
                              )}
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        {isPubgMobile ? (
                          <select
                            value={serverIdInput}
                            onChange={(e) =>
                              handleServerIdInputChange(e.target.value)
                            }
                            className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                          >
                            <option value="">
                              {t("user.selectServer") || "Выберите сервер"}
                            </option>
                            <option value="Asia">Asia</option>
                            <option value="Europe">Europe</option>
                            <option value="North America">North America</option>
                            <option value="South America">South America</option>
                            <option value="Middle East">Middle East</option>
                            <option value="Korea/Japan">Korea/Japan</option>
                          </select>
                        ) : (
                          <>
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              (
                            </div>
                            <input
                              type="text"
                              placeholder={t("user.userServerPlaceholder")}
                              value={serverIdInput}
                              onChange={(e) =>
                                handleServerIdInputChange(e.target.value)
                              }
                              className="w-full p-3 px-8 border border-gray-200 rounded-lg text-center"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              )
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>

                {/* Validation Result */}
                {(isBigo || isDonatBank || isPubgMobile) &&
                  hasValidated &&
                  validationResult && (
                    <div
                      className={`mt-3 p-3 rounded-lg border ${
                        validationResult.isValid
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div
                        className={`flex items-center ${
                          validationResult.isValid
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {validationResult.isValid ? (
                          <CheckCircle size={16} className="mr-2" />
                        ) : (
                          <AlertTriangle size={16} className="mr-2" />
                        )}
                        <span className="font-medium">
                          {validationResult.isValid
                            ? getTranslation("idValid")
                            : getTranslation("idNotFound")}
                        </span>
                      </div>
                      {!validationResult.isValid &&
                        validationResult.errorMessage && (
                          <div className="mt-1 text-sm text-red-600">
                            {isPubgMobile
                              ? validationResult.errorMessage
                              : getTranslation("userNotFound")}
                          </div>
                        )}
                    </div>
                  )}
              </div>
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
            packageDiscount={selectedCurrency?.discountPercent || 0}
            telegramDiscount={
              telegramMembershipValid &&
              selectedCurrency &&
              selectedCurrency.amount <= 300 &&
              !me?.telegram_discount_used
                ? selectedCurrency.originalPriceRub * 0.05
                : 0
            }
            referralDiscount={
              me?.referral_discount && selectedCurrency
                ? (selectedCurrency.originalPriceRub *
                    Number(me.referral_discount)) /
                  100
                : 0
            }
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

      {/* Alert Components */}
      <CustomAlert
        isOpen={showSpaceWarning}
        onClose={() => setShowSpaceWarning(false)}
        message={
          <div className="space-y-2">
            <div className="flex items-center text-amber-600">
              <AlertTriangle size={16} className="mr-2" />
              <span className="font-medium">
                {locale === "ru" ? "Предупреждение" : "Warning"}
              </span>
            </div>
            <div className="text-sm">
              {locale === "en" && (
                <div className="mb-1">🇺🇸 {errorMessages.en.spaceWarning}</div>
              )}
              {locale === "ru" && <div>🇷🇺 {errorMessages.ru.spaceWarning}</div>}
              {locale !== "en" && locale !== "ru" && (
                <>
                  <div className="mb-1">🇺🇸 {errorMessages.en.spaceWarning}</div>
                  <div>🇷🇺 {errorMessages.ru.spaceWarning}</div>
                </>
              )}
            </div>
          </div>
        }
      />

      <CustomAlert
        isOpen={showIdPrefixWarning}
        onClose={() => setShowIdPrefixWarning(false)}
        message={
          <div className="space-y-2">
            <div className="flex items-center text-amber-600">
              <AlertTriangle size={16} className="mr-2" />
              <span className="font-medium">
                {locale === "ru" ? "Предупреждение" : "Warning"}
              </span>
            </div>
            <div className="text-sm">
              {locale === "en" && (
                <div className="mb-1">
                  🇺🇸 Please don't include "ID:" in your User ID. Just enter the
                  numbers.
                </div>
              )}
              {locale === "ru" && (
                <div>
                  🇷🇺 Пожалуйста, не включайте "ID:" в ваш User ID. Введите
                  только цифры.
                </div>
              )}
              {locale !== "en" && locale !== "ru" && (
                <>
                  <div className="mb-1">
                    🇺🇸 Please don't include "ID:" in your User ID. Just enter
                    the numbers.
                  </div>
                  <div>
                    🇷🇺 Пожалуйста, не включайте "ID:" в ваш User ID. Введите
                    только цифры.
                  </div>
                </>
              )}
            </div>
          </div>
        }
      />

      <CustomAlert
        isOpen={showSpecialCharsWarning}
        onClose={() => setShowSpecialCharsWarning(false)}
        message={
          <div className="space-y-2">
            <div className="flex items-center text-amber-600">
              <AlertTriangle size={16} className="mr-2" />
              <span className="font-medium">
                {locale === "ru" ? "Предупреждение" : "Warning"}
              </span>
            </div>
            <div className="text-sm">
              {locale === "en" && (
                <div className="mb-1">
                  🇺🇸 Only English letters, numbers, dot (.) and underscore (_)
                  are allowed{isPubgMobile ? ", plus @ and - for email" : ""}.
                </div>
              )}
              {locale === "ru" && (
                <div>
                  🇷🇺 Разрешены только английские буквы, цифры, точка (.) и
                  нижнее подчеркивание (_)
                  {isPubgMobile ? ", плюс @ и - для email" : ""}.
                </div>
              )}
              {locale !== "en" && locale !== "ru" && (
                <>
                  <div className="mb-1">
                    🇺🇸 Only English letters, numbers, dot (.) and underscore (_)
                    are allowed{isPubgMobile ? ", plus @ and - for email" : ""}.
                  </div>
                  <div>
                    🇷🇺 Разрешены только английские буквы, цифры, точка (.) и
                    нижнее подчеркивание (_)
                    {isPubgMobile ? ", плюс @ и - для email" : ""}.
                  </div>
                </>
              )}
            </div>
          </div>
        }
      />
    </>
  );
}
