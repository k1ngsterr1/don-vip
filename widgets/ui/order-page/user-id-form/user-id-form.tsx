"use client";

import { AlertTriangle, CheckCircle, Loader } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CustomTooltip } from "@/shared/ui/tooltip/tooltip";
import { useEffect, useState } from "react";
import { CustomAlert } from "../alert/alert";
import QuestionIcon from "@/shared/icons/question-icon";
import { useValidateBigoUser } from "@/entities/bigo/hooks/use-validate-bigo";

interface UserIdFormProps {
  apiGame?: string;
  productType?: string;
  requiresServer: boolean;
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
  userId,
  serverId,
  onUserIdChange,
  onServerIdChange,
  onValidationChange,
}: UserIdFormProps) {
  const t = useTranslations("orderBlock.user");
  const isPubgMobile = apiGame === "pubgmobile";
  const isDonatBank = productType === "DonatBank";
  const isBigo = productType === "Bigo";
  const needsEmail = isPubgMobile; // Убираем DonatBank из условия email
  const locale = useLocale();
  const [userIdInput, setUserIdInput] = useState(userId);
  const [serverIdInput, setServerIdInput] = useState(serverId);
  const [showSpaceWarning, setShowSpaceWarning] = useState(false);
  const [spaceWarningField, setSpaceWarningField] = useState<
    "userId" | "serverId"
  >("userId");

  // Bigo validation
  const {
    validateUser,
    isValidating,
    error: validationError,
  } = useValidateBigoUser();
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    username?: string;
    vipStatus?: string;
    errorMessage?: string;
  } | null>(null);
  const [hasValidated, setHasValidated] = useState(false);

  const errorMessages = {
    en: {
      spaceWarning:
        "Spaces are not allowed and have been automatically removed.",
    },
    ru: {
      spaceWarning: "Пробелы не допускаются и были автоматически удалены.",
    },
  };

  const isEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  useEffect(() => {
    onUserIdChange(userIdInput);

    // Проверяем изначальную валидность при монтировании или изменении userIdInput
    if (isBigo) {
      if (userIdInput.trim().length >= 4 && hasValidated && validationResult) {
        onValidationChange?.(validationResult.isValid);
      } else {
        onValidationChange?.(false);
      }
    } else {
      // Для всех продуктов кроме Bigo - всегда валидно
      onValidationChange?.(true);
    }
  }, [
    userIdInput,
    onUserIdChange,
    isBigo,
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
    const cleanValue = handleSpaceDetection(value, "userId");
    setUserIdInput(cleanValue);

    // Reset validation when ID changes
    if (isBigo && hasValidated) {
      setHasValidated(false);
      setValidationResult(null);
      onValidationChange?.(false); // Сообщаем, что валидность сброшена
    }

    // Auto-validate for Bigo if ID looks complete (e.g., more than 3 characters)
    if (isBigo && cleanValue.trim().length >= 4) {
      // Debounce the validation to avoid too many API calls
      setTimeout(() => {
        if (userIdInput === cleanValue && cleanValue.trim().length >= 4) {
          handleValidateUserId();
        }
      }, 1000);
    } else if (isBigo && cleanValue.trim().length < 4) {
      // If ID is too short for Bigo, mark as invalid
      onValidationChange?.(false);
    } else if (!isBigo) {
      // For non-Bigo products, always valid
      onValidationChange?.(true);
    }
  };

  const handleServerIdChange = (value: string) => {
    const cleanValue = handleSpaceDetection(value, "serverId");
    setServerIdInput(cleanValue);
    onServerIdChange(cleanValue);
  };

  const handleValidateUserId = async () => {
    if (!isBigo || !userIdInput.trim()) {
      return;
    }

    try {
      const result = await validateUser(userIdInput);
      setValidationResult(result);
      setHasValidated(true);

      // Информируем родительский компонент о результате валидации
      onValidationChange?.(result.isValid);
    } catch (error) {
      console.error("Validation error:", error);
      // Set error state if validation fails
      const errorResult = {
        isValid: false,
        errorMessage:
          validationError ||
          (locale === "ru" ? "Ошибка валидации" : "Validation error"),
      };
      setValidationResult(errorResult);
      setHasValidated(true);

      // Информируем родительский компонент о неудачной валидации
      onValidationChange?.(false);
    }
  };

  // Get space warning message based on locale
  const getSpaceWarningMessage = () => {
    if (locale === "ru") {
      return errorMessages.ru.spaceWarning;
    }
    return errorMessages.en.spaceWarning;
  };

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center mb-4">
        <h2 className="text-dark font-roboto font-medium">
          {needsEmail
            ? requiresServer
              ? "Enter your Email and Server ID"
              : "Enter your Email"
            : requiresServer
            ? t("enterIdAndServer")
            : t("enterIdNoPrefix")}
        </h2>
        <CustomTooltip
          content={
            <div className="p-1">
              {requiresServer
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
        {!requiresServer && (
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
                isBigo ? "pr-10" : ""
              } border rounded-lg ${
                hasValidated && validationResult
                  ? validationResult.isValid
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : "border-gray-200"
              }`}
            />
            {/* Bigo validation indicators */}
            {isBigo && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {isValidating && (
                  <Loader className="w-5 h-5 animate-spin text-blue-500" />
                )}
                {hasValidated && validationResult && !isValidating && (
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

        {requiresServer ? (
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
                  isBigo ? "pr-10" : ""
                } border rounded-lg ${
                  hasValidated && validationResult
                    ? validationResult.isValid
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-gray-200"
                }`}
              />
              {/* Bigo validation indicators */}
              {isBigo && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {isValidating && (
                    <Loader className="w-5 h-5 animate-spin text-blue-500" />
                  )}
                  {hasValidated && validationResult && !isValidating && (
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
            </div>
          </>
        ) : null}
      </div>

      {/* Bigo Validation Result */}
      {isBigo && hasValidated && validationResult && (
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
                ? locale === "ru"
                  ? "ID действителен"
                  : "ID is valid"
                : locale === "ru"
                ? "ID не найден"
                : "ID not found"}
            </span>
          </div>
          {validationResult.isValid && validationResult.username && (
            <div className="mt-1 text-sm text-green-600">
              {locale === "ru" ? "Пользователь" : "Username"}:{" "}
              {validationResult.username}
              {validationResult.vipStatus && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  {validationResult.vipStatus}
                </span>
              )}
            </div>
          )}
          {!validationResult.isValid && validationResult.errorMessage && (
            <div className="mt-1 text-sm text-red-600">
              {validationResult.errorMessage}
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
    </div>
  );
}
