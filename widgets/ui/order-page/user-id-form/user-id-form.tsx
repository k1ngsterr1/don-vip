"use client";

import { AlertTriangle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CustomTooltip } from "@/shared/ui/tooltip/tooltip";
import { useEffect, useState } from "react";
import { CustomAlert } from "../alert/alert";
import QuestionIcon from "@/shared/icons/question-icon";

interface UserIdFormProps {
  apiGame?: string;
  productType?: string;
  requiresServer: boolean;
  userId: string;
  serverId: string;
  onUserIdChange: (value: string) => void;
  onServerIdChange: (value: string) => void;
}

export function UserIdForm({
  apiGame,
  productType,
  requiresServer,
  userId,
  serverId,
  onUserIdChange,
  onServerIdChange,
}: UserIdFormProps) {
  const t = useTranslations("orderBlock.user");
  const isPubgMobile = apiGame === "pubgmobile";
  const isDonatBank = productType === "DonatBank";
  const needsEmail = isPubgMobile; // Убираем DonatBank из условия email
  const locale = useLocale();
  const [userIdInput, setUserIdInput] = useState(userId);
  const [serverIdInput, setServerIdInput] = useState(serverId);
  const [showSpaceWarning, setShowSpaceWarning] = useState(false);
  const [spaceWarningField, setSpaceWarningField] = useState<
    "userId" | "serverId"
  >("userId");

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
  }, [userIdInput, onUserIdChange]);

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
  };

  const handleServerIdChange = (value: string) => {
    const cleanValue = handleSpaceDetection(value, "serverId");
    setServerIdInput(cleanValue);
    onServerIdChange(cleanValue);
  };

  const handleValidateUserId = async () => {
    // No validation, just a placeholder
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
              onBlur={handleValidateUserId}
              className={`w-full p-3 ${
                needsEmail ? "pl-3" : "pl-10"
              } border border-gray-200 rounded-lg`}
            />
          </div>
        )}

        {requiresServer ? (
          <>
            <input
              type={needsEmail ? "email" : "text"}
              placeholder={
                needsEmail ? t("userEmailPlaceholder") : t("userIdPlaceholder")
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
                className="w-full p-3 px-8 border border-gray-200 rounded-lg text-center"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                )
              </div>
            </div>
          </>
        ) : null}
      </div>

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
