"use client";

import { Loader2, Check, AlertCircle, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { CustomTooltip } from "@/shared/ui/tooltip/tooltip";
import { useEffect, useState } from "react";
import { CustomAlert } from "../alert/alert";
import QuestionIcon from "@/shared/icons/question-icon";
import { useValidateBigoUser } from "@/entities/bigo/hooks/use-validate-bigo";
import { useValidateSmileUser } from "@/entities/smile/hooks/use-validate-smile";

interface UserIdFormProps {
  apiGame?: string;
  requiresServer: boolean;
  userId: string;
  serverId: string;
  onUserIdChange: (value: string) => void;
  onServerIdChange: (value: string) => void;
}

export function UserIdForm({
  apiGame,
  requiresServer,
  userId,
  serverId,
  onUserIdChange,
  onServerIdChange,
}: UserIdFormProps) {
  const t = useTranslations("orderBlock.user");
  const isPubgMobile = apiGame === "pubgmobile";
  const locale = useLocale();

  const { validateUser: validateBigoUser, isValidating: isBigoValidating } =
    useValidateBigoUser();
  const { validateUser: validateSmileUser, isValidating: isSmileValidating } =
    useValidateSmileUser();
  const [userIdInput, setUserIdInput] = useState(userId);
  const [serverIdInput, setServerIdInput] = useState(serverId);
  const [userInfo, setUserInfo] = useState<{
    username?: string;
    vipStatus?: string;
  } | null>(null);
  const [validationError, setValidationError] = useState("");
  const [validationErrorCode, setValidationErrorCode] = useState<number | null>(
    null
  );
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSpaceWarning, setShowSpaceWarning] = useState(false);
  const [spaceWarningField, setSpaceWarningField] = useState<
    "userId" | "serverId"
  >("userId");

  const errorMessages = {
    en: {
      accountNotFound: "Account not found. Please check your ID and try again.",
      invalidUserId: "Invalid user ID format. Please enter a valid ID.",
      validationFailed: "Validation failed. Please try again.",
      networkError:
        "Network error. Please check your connection and try again.",
      serverIdRequired: "Server ID is required for validation.",
      idNotExists: "ID does not exist.",
      validationError: "Failed to validate ID.",
      spaceWarning:
        "Spaces are not allowed and have been automatically removed.",
    },
    ru: {
      accountNotFound:
        "Аккаунт не найден. Пожалуйста, проверьте ID и попробуйте снова.",
      invalidUserId:
        "Неверный формат ID пользователя. Пожалуйста, введите корректный ID.",
      validationFailed: "Проверка не удалась. Пожалуйста, попробуйте снова.",
      networkError:
        "Ошибка сети. Пожалуйста, проверьте подключение и попробуйте снова.",
      serverIdRequired: "Требуется ID сервера для проверки.",
      idNotExists: "ID не существует.",
      validationError: "Не удалось проверить ID.",
      spaceWarning: "Пробелы не допускаются и были автоматически удалены.",
    },
  };

  const isEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  useEffect(() => {
    if (userIdInput !== userId && !validationError && userInfo) {
      onUserIdChange(userIdInput);
    }
  }, [userIdInput, userId, validationError, userInfo, onUserIdChange]);

  const isValidating = isBigoValidating || isSmileValidating;

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
    setUserInfo(null);
    setValidationError("");
    setValidationErrorCode(null);
  };

  const handleServerIdChange = (value: string) => {
    const cleanValue = handleSpaceDetection(value, "serverId");
    setServerIdInput(cleanValue);
    onServerIdChange(cleanValue);
  };

  const handleValidateUserId = async () => {
    const trimmed = userIdInput.trim();

    if (!trimmed) return;

    // Skip validation for email
    if (isEmail(trimmed)) {
      setValidationError("");
      setValidationErrorCode(null);
      setUserInfo({
        username: trimmed,
        vipStatus: undefined,
      });
      return;
    }

    try {
      let result;

      if (requiresServer) {
        // Use Smile validation when server is required
        const trimmedServerId = serverIdInput.trim();
        if (!trimmedServerId) {
          setValidationError(
            locale === "ru"
              ? errorMessages.ru.serverIdRequired
              : errorMessages.en.serverIdRequired
          );
          setValidationErrorCode(null);
          setShowErrorAlert(true);
          setUserInfo(null);
          return;
        }
        result = await validateSmileUser(trimmed, trimmedServerId, apiGame);
      } else {
        // Use Bigo validation when no server is required
        result = await validateBigoUser(trimmed);
      }

      if (!result.isValid) {
        setValidationError(
          result.errorMessage ||
            (locale === "ru"
              ? errorMessages.ru.idNotExists
              : errorMessages.en.idNotExists)
        );
        setValidationErrorCode(result.errorCode || null);
        setShowErrorAlert(true);
        setUserInfo(null);
      } else {
        setUserInfo({
          username: result.username,
          vipStatus: requiresServer ? undefined : (result as any).vipStatus,
        });
        setValidationError("");
        setValidationErrorCode(null);
      }
    } catch (err) {
      setValidationError(
        locale === "ru"
          ? errorMessages.ru.validationError
          : errorMessages.en.validationError
      );
      setValidationErrorCode(null);
      setShowErrorAlert(true);
      setUserInfo(null);
    }
  };

  // Format error message based on error code and locale
  const getFormattedErrorMessage = () => {
    const messages = locale === "ru" ? errorMessages.ru : errorMessages.en;

    switch (validationErrorCode) {
      case -32024:
        return messages.accountNotFound;
      case -32025:
        return messages.invalidUserId;
      case -32026:
        return messages.validationFailed;
      case -1:
        return messages.networkError;
      default:
        return validationError || messages.validationFailed;
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
          {isPubgMobile
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
            {!isPubgMobile && (
              <div className="absolute left-3 font-roboto font-black text-black text-[13px] top-1/2 transform -translate-y-1/2 text-sm">
                {t("idPrefix")}
              </div>
            )}
            <input
              type={isPubgMobile ? "email" : "text"}
              placeholder={
                isPubgMobile
                  ? t("userEmailPlaceholder")
                  : t("userIdPlaceholder")
              }
              value={userIdInput}
              onChange={(e) => handleUserIdChange(e.target.value)}
              onBlur={handleValidateUserId}
              className={`w-full p-3 ${
                isPubgMobile ? "pl-3" : "pl-10"
              } border ${
                validationError
                  ? "border-red-500"
                  : userInfo
                  ? "border-green-500"
                  : "border-gray-200"
              } rounded-lg`}
            />
            {isValidating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 size={18} className="animate-spin text-blue" />
              </div>
            )}
            {userInfo && !isValidating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check size={18} className="text-green-500" />
              </div>
            )}
            {validationError && !isValidating && (
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowErrorAlert(true)}
              >
                <AlertCircle size={18} className="text-red-500" />
              </div>
            )}
          </div>
        )}

        {userInfo && userInfo.username && !requiresServer && (
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-600 font-roboto">
              {userInfo.username}
            </span>
            {userInfo.vipStatus && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 font-condensed">
                <span className="mr-1">⭐</span>
                {userInfo.vipStatus}
              </span>
            )}
          </div>
        )}

        {requiresServer ? (
          <>
            <input
              type={isPubgMobile ? "email" : "text"}
              placeholder={
                isPubgMobile
                  ? t("userEmailPlaceholder")
                  : t("userIdPlaceholder")
              }
              value={userIdInput}
              onChange={(e) => handleUserIdChange(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                (
              </div>
              <input
                type="text"
                placeholder={t("userServerPlaceholder")}
                value={serverIdInput}
                onChange={(e) => handleServerIdChange(e.target.value)}
                onBlur={() => {
                  if (userIdInput.trim() && serverIdInput.trim()) {
                    handleValidateUserId();
                  }
                }}
                className="w-full p-3 px-8 border border-gray-200 rounded-lg text-center"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                )
              </div>
            </div>
          </>
        ) : (
          <>
            {!isPubgMobile && (
              <>
                <div className="mt-4 mb-2">
                  <h3 className="text-[16px] font-bold font-condensed mb-2">
                    {t("findBigoId.title")}
                  </h3>
                  <ol className="text-[15px] font-condensed text-gray-600 space-y-1 list-decimal pl-5">
                    <li className="text-black text-[17px]">
                      {t("findBigoId.step1")}
                    </li>
                    <li className="text-black font-condensed text-[17px]">
                      {t("findBigoId.step2")}
                    </li>
                    <li className="text-black font-condensed text-[17px]">
                      {t("findBigoId.step3")}
                    </li>
                    <li className="text-black font-condensed text-[17px]">
                      {t("findBigoId.step4")}
                    </li>
                  </ol>
                </div>
                <Image
                  src="/check.webp"
                  width={250}
                  height={46}
                  className="w-[250px] h-[46px]"
                  alt={t("checkImageAlt")}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Custom Error Alert */}
      <CustomAlert
        isOpen={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        message={getFormattedErrorMessage()}
      />

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
