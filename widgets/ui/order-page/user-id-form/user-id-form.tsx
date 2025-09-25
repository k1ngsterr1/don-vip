"use client";

import { AlertTriangle, CheckCircle, Loader } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CustomTooltip } from "@/shared/ui/tooltip/tooltip";
import { useEffect, useState, useCallback } from "react";
import { CustomAlert } from "../alert/alert";
import QuestionIcon from "@/shared/icons/question-icon";
import { useValidateBigoUser } from "@/entities/bigo/hooks/use-validate-bigo";
// import { useValidateSmileUser } from "@/entities/smile/hooks/use-validate-smile"; // Заменено на Donatbank
import { useValidateUser } from "@/entities/user/hooks/use-validate-user";
import { useDebounce } from "@/shared/hooks/use-debounce";

interface UserIdFormProps {
  apiGame?: string;
  productType?: string;
  requiresServer?: boolean;
  gameData?: any; // Добавляем данные игры из API
  gameId?: number; // Добавляем ID игры для Donatbank валидации
  // Add product requirement fields
  productRequirements?: {
    isServerRequired?: boolean;
    requireUserId?: boolean;
    requireServer?: boolean;
    requireEmail?: boolean;
    requireUID?: boolean;
  };
  userId: string;
  serverId: string;
  onUserIdChange: (value: string) => void;
  onServerIdChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void; // Добавляем колбэк для информирования о валидности
}

export function UserIdForm({
  apiGame,
  productType,
  requiresServer,
  gameData,
  gameId,
  productRequirements,
  userId,
  serverId,
  onUserIdChange,
  onServerIdChange,
  onValidationChange,
}: UserIdFormProps) {
  const t = useTranslations("orderBlock.user");
  const isPubgMobile = apiGame === "pubgmobile" || apiGame === "PUBG";
  const isDonatBank =
    productType === "DonatBank" ||
    productType === "Smile" ||
    (apiGame && productType !== "Bigo" && !isPubgMobile);
  const isBigo = productType === "Bigo";
  const isSmile = false; // Заменено все Smile на DonatBank - удалить после тестирования

  console.log("UserIdForm initialized:", {
    productType,
    isDonatBank,
    isBigo,

    gameId,
    gameData: gameData?.id,
  });

  // Use product requirements from the database instead of hardcoded logic
  const needsEmail = productRequirements?.requireEmail || isPubgMobile; // Keep PUBG logic for backward compatibility
  const locale = useLocale();

  // Determine server requirement from product requirements or fallback to existing logic
  const isServerRequired =
    productRequirements?.requireServer ||
    productRequirements?.isServerRequired ||
    gameData?.isServerRequired ||
    requiresServer;

  console.log("UserIdForm initialized:", {
    productType,
    isBigo,
    isServerRequired,
    gameData,
    productRequirements,
    needsEmail,
  }); // Для отладки
  const [userIdInput, setUserIdInput] = useState(userId);
  const [serverIdInput, setServerIdInput] = useState(serverId);
  const [showSpaceWarning, setShowSpaceWarning] = useState(false);
  const [spaceWarningField, setSpaceWarningField] = useState<
    "userId" | "serverId"
  >("userId");
  const [showIdPrefixWarning, setShowIdPrefixWarning] = useState(false);

  // Bigo validation
  const {
    validateUser,
    isValidating,
    error: validationError,
  } = useValidateBigoUser();

  // Smile validation заменено на Donatbank
  const isValidatingSmile = false; // Удалить после завершения миграции
  const smileValidationError = null; // Удалить после завершения миграции

  // Donatbank validation
  const {
    mutate: validateDonatbankUser,
    isPending: isValidatingDonatbank,
    error: donatbankValidationError,
  } = useValidateUser();
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    username?: string;
    vipStatus?: string;
    errorMessage?: string;
  } | null>(null);
  const [hasValidated, setHasValidated] = useState(false);

  // Debounced user ID for validation
  const debouncedUserId = useDebounce(userIdInput, 1000);

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

  useEffect(() => {
    // Handle validation based on product type
    if (isBigo && debouncedUserId.trim().length >= 4) {
      console.log("Starting debounced Bigo validation for:", debouncedUserId);
      handleValidateUserId(debouncedUserId.trim());
    } else if (isDonatBank && debouncedUserId.trim().length >= 4) {
      console.log(
        "Starting debounced Donatbank validation for:",
        debouncedUserId,
        "gameId:",
        gameId
      );
      handleValidateUserId(debouncedUserId.trim());
    } else if (isPubgMobile) {
      // For PUBG, validate email format locally
      const emailValid = isEmail(debouncedUserId);
      console.log(
        "PUBG email validation:",
        debouncedUserId,
        "valid:",
        emailValid
      );
      setValidationResult({
        isValid: emailValid,
        username: emailValid ? "Email format valid" : undefined,
        errorMessage: emailValid ? undefined : "Invalid email format",
      });
      setHasValidated(true);
      onValidationChange?.(emailValid);
    } else if ((isBigo || isDonatBank) && debouncedUserId.trim().length < 4) {
      // Reset validation state for short IDs
      setHasValidated(false);
      setValidationResult(null);
      onValidationChange?.(false);
    }
  }, [
    debouncedUserId,
    serverIdInput,
    isBigo,
    isPubgMobile,
    isDonatBank,
    gameId,
  ]);

  useEffect(() => {
    onUserIdChange(userIdInput);

    if (isBigo || isDonatBank) {
      if (userIdInput.trim().length >= 4 && hasValidated && validationResult) {
        onValidationChange?.(validationResult.isValid);
      } else {
        onValidationChange?.(false);
      }
    } else if (isPubgMobile) {
      // For PUBG, validate email format locally
      const emailValid = isEmail(userIdInput);
      onValidationChange?.(emailValid);
    } else {
      // For other products - validate by length
      const isValidLength = userIdInput.trim().length >= 4;
      onValidationChange?.(isValidLength);
    }
  }, [
    userIdInput,
    onUserIdChange,
    isBigo,
    isDonatBank,
    isPubgMobile,
    hasValidated,
    validationResult,
    onValidationChange,
  ]);

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

  const handleUserIdChange = (value: string) => {
    console.log(
      "handleUserIdChange called with:",
      value,
      "productType:",
      productType
    );

    // Валидация: запретить ввод "ID:" в начале или в любом месте
    if (value.toLowerCase().includes("id:")) {
      // Показываем предупреждение
      setShowIdPrefixWarning(true);
      // Удаляем "ID:" из строки (в любом регистре)
      value = value.replace(/id:/gi, "");

      // Скрываем предупреждение через 3 секунды
      setTimeout(() => {
        setShowIdPrefixWarning(false);
      }, 3000);
    }

    const cleanValue = handleSpaceDetection(value, "userId");
    setUserIdInput(cleanValue);

    // Reset validation when ID changes for products that require API validation
    if ((isBigo || isDonatBank) && hasValidated) {
      setHasValidated(false);
      setValidationResult(null);
      onValidationChange?.(false); // Inform that validity is reset
    }

    // For PUBG, validate email format immediately
    if (isPubgMobile) {
      const emailValid = isEmail(cleanValue);
      onValidationChange?.(emailValid);
    } else if (!isBigo && !isDonatBank) {
      // For other products without API validation, consider valid if ID has reasonable length
      const isValidLength = cleanValue.trim().length >= 4;
      onValidationChange?.(isValidLength);
    }
  };

  const handleServerIdChange = (value: string) => {
    // Валидация: запретить ввод "ID:" в Server ID
    if (value.toLowerCase().includes("id:")) {
      // Показываем предупреждение
      setShowIdPrefixWarning(true);
      // Удаляем "ID:" из строки (в любом регистре)
      value = value.replace(/id:/gi, "");

      // Скрываем предупреждение через 3 секунды
      setTimeout(() => {
        setShowIdPrefixWarning(false);
      }, 3000);
    }

    const cleanValue = handleSpaceDetection(value, "serverId");
    setServerIdInput(cleanValue);
    onServerIdChange(cleanValue);

    // Reset DonatBank validation when server ID changes
    if (isDonatBank && hasValidated) {
      setHasValidated(false);
      setValidationResult(null);
      onValidationChange?.(false);
    }
  };

  const handleValidateUserId = async (valueToValidate?: string) => {
    const targetValue = valueToValidate || userIdInput.trim();

    if (!targetValue) {
      return;
    }

    // Bigo validation
    if (isBigo) {
      console.log("Validating Bigo ID:", targetValue);
      try {
        const result = await validateUser(targetValue);
        setValidationResult(result);
        setHasValidated(true);
        onValidationChange?.(result.isValid);
      } catch (error) {
        console.error("Bigo validation error:", error);
        const errorResult = {
          isValid: false,
          errorMessage:
            validationError ||
            (locale === "ru" ? "Ошибка валидации" : "Validation error"),
        };
        setValidationResult(errorResult);
        setHasValidated(true);
        onValidationChange?.(false);
      }
      return;
    }

    // Donatbank validation
    if (isDonatBank && gameId) {
      console.log("Validating Donatbank ID:", targetValue, "for game:", gameId);
      try {
        validateDonatbankUser(
          { userId: targetValue, gameId, zoneId: serverId },
          {
            onSuccess: (result) => {
              console.log("Donatbank validation result:", result);
              const validationResultFormatted = {
                isValid: result.validated,
                username: result.nickname || undefined,
                errorMessage: result.validated ? undefined : result.message,
              };
              setValidationResult(validationResultFormatted);
              setHasValidated(true);
              onValidationChange?.(result.validated);
            },
            onError: (error) => {
              console.error("Donatbank validation error:", error);
              const errorResult = {
                isValid: false,
                errorMessage:
                  locale === "ru"
                    ? "Ошибка валидации пользователя"
                    : "User validation error",
              };
              setValidationResult(errorResult);
              setHasValidated(true);
              onValidationChange?.(false);
            },
          }
        );
      } catch (error) {
        console.error("Donatbank validation catch error:", error);
      }
    }
  };

  const handleValidateSmileUser = async (userId: string, serverId: string) => {
    // Deprecated: Smile validation заменена на DonatBank через handleValidateUserId
    console.log(
      "Deprecated Smile validation - redirecting to DonatBank validation"
    );
    handleValidateUserId(userId);
  };

  // Get space warning message based on locale
  const getSpaceWarningMessage = () => {
    if (locale === "ru") {
      return errorMessages.ru.spaceWarning;
    }
    return errorMessages.en.spaceWarning;
  };

  // Get translation message based on locale
  const getTranslation = (key: keyof typeof errorMessages.en) => {
    if (locale === "ru") {
      return errorMessages.ru[key];
    }
    return errorMessages.en[key];
  };

  return (
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
            ? t("enterIdAndServer")
            : productRequirements?.requireUID
            ? locale === "ru"
              ? "Введите ваш User ID и UID"
              : "Enter your User ID and UID"
            : t("enterIdNoPrefix")}
        </h2>
        <CustomTooltip
          content={
            <div className="p-1">
              {isServerRequired
                ? t("tooltipTextWithServer", {
                    defaultValue:
                      "Enter your user ID and server ID to proceed with the order. Both fields are required for proper identification.",
                  })
                : t("tooltipTextWithoutServer", {
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
                {t("idPrefix")}
              </div>
            )}
            <input
              type={needsEmail ? "email" : "text"}
              placeholder={
                needsEmail ? t("userEmailPlaceholder") : t("userIdPlaceholder")
              }
              value={userIdInput}
              onChange={(e) => handleUserIdChange(e.target.value)}
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
                    ? t("userEmailPlaceholder")
                    : t("userIdPlaceholder")
                }
                value={userIdInput}
                onChange={(e) => handleUserIdChange(e.target.value)}
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
                  onChange={(e) => handleServerIdChange(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                >
                  <option value="">
                    {t("selectServer") || "Выберите сервер"}
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
                    placeholder={t("userServerPlaceholder")}
                    value={serverIdInput}
                    onChange={(e) => handleServerIdChange(e.target.value)}
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

      {/* Validation Result for Bigo, DonatBank, and PUBG */}
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
            {/* {validationResult.isValid && validationResult.username && (
              <div className="mt-1 text-sm text-green-600">
                {getTranslation("username")}: {validationResult.username}
                {validationResult.vipStatus && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    {validationResult.vipStatus}
                  </span>
                )}
              </div>
            )} */}
            {!validationResult.isValid && validationResult.errorMessage && (
              <div className="mt-1 text-sm text-red-600">
                {isPubgMobile
                  ? validationResult.errorMessage
                  : getTranslation("userNotFound")}
              </div>
            )}
          </div>
        )}

      {/* Space Warning Alert */}
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

      {/* ID Prefix Warning Alert */}
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
    </div>
  );
}
