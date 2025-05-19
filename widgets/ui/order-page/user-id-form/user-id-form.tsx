"use client";

import { HelpCircle, Loader2, Check, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CustomTooltip } from "@/shared/ui/tooltip/tooltip";
import { useEffect, useState } from "react";
import { CustomAlert } from "../alert/alert";
import { useValidateBigoUser } from "@/entities/bigo/hooks/use-validate-bigo";

interface UserIdFormProps {
  requiresServer: boolean;
  userId: string;
  serverId: string;
  agreeToTerms: boolean;
  onUserIdChange: (value: string) => void;
  onServerIdChange: (value: string) => void;
  onAgreeChange: (value: boolean) => void;
}

export function UserIdForm({
  requiresServer,
  userId,
  serverId,
  agreeToTerms,
  onUserIdChange,
  onServerIdChange,
  onAgreeChange,
}: UserIdFormProps) {
  const t = useTranslations("orderBlock.user");
  const { validateUser, isValidating, error, errorCode } =
    useValidateBigoUser();
  const [userIdInput, setUserIdInput] = useState(userId);
  const [userInfo, setUserInfo] = useState<{
    username?: string;
    vipStatus?: string;
  } | null>(null);
  const [validationError, setValidationError] = useState("");
  const [validationErrorCode, setValidationErrorCode] = useState<number | null>(
    null
  );
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    if (userIdInput !== userId && !validationError && userInfo) {
      onUserIdChange(userIdInput);
    }
  }, [userIdInput, userId, validationError, userInfo, onUserIdChange]);

  const handleValidateBigoId = async () => {
    if (!userIdInput.trim()) {
      return;
    }

    try {
      const result = await validateUser(userIdInput);

      if (!result.isValid) {
        setValidationError(result.errorMessage || "ID не существвует");
        setValidationErrorCode(result.errorCode || null);
        setShowErrorAlert(true);
        setUserInfo(null);
      } else {
        setUserInfo({
          username: result.username,
          vipStatus: result.vipStatus,
        });
        setValidationError("");
        setValidationErrorCode(null);
      }
    } catch (err) {
      setValidationError("Не удалось проверить ID");
      setValidationErrorCode(null);
      setShowErrorAlert(true);
      setUserInfo(null);
    }
  };

  // Format error message based on error code
  const getFormattedErrorMessage = () => {
    if (validationErrorCode === -32024) {
      return "The account hasn't been found";
    }
    return validationError || "ID не существвует";
  };

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center mb-4">
        <h2 className="text-dark font-roboto font-medium">
          {t("step")}{" "}
          {requiresServer ? t("enterIdAndServer") : t("enterIdNoPrefix")}
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
          <HelpCircle size={16} className="ml-2 text-gray-400 cursor-help" />
        </CustomTooltip>
      </div>
      <div className="space-y-3">
        {!requiresServer && (
          <div className="relative">
            <div className="absolute left-3 font-roboto font-black text-black text-[13px] top-1/2 transform -translate-y-1/2 text-sm">
              {t("idPrefix")}
            </div>
            <input
              type="text"
              placeholder={t("userIdPlaceholder")}
              value={userIdInput}
              onChange={(e) => {
                setUserIdInput(e.target.value);
                setUserInfo(null);
                setValidationError("");
                setValidationErrorCode(null);
              }}
              onBlur={handleValidateBigoId}
              className={`w-full p-3 pl-10 border ${
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

        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreeToTerms}
            onChange={() => onAgreeChange(!agreeToTerms)}
            className="mr-2 h-4 w-4 accent-blue-500"
          />
          <label htmlFor="terms" className="text-[11px] text-gray-600">
            {t("confirmDataCorrectness")}
          </label>
        </div>

        {requiresServer ? (
          <>
            <input
              type="text"
              placeholder={t("userIdPlaceholder")}
              value={userIdInput}
              onChange={(e) => {
                setUserIdInput(e.target.value);
                onUserIdChange(e.target.value);
              }}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                (
              </div>
              <input
                type="text"
                placeholder={t("userServerPlaceholder")}
                value={serverId}
                onChange={(e) => onServerIdChange(e.target.value)}
                className="w-full p-3 px-8 border border-gray-200 rounded-lg text-center"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                )
              </div>
            </div>
          </>
        ) : (
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
      </div>

      {/* Custom Error Alert */}
      <CustomAlert
        isOpen={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        message={getFormattedErrorMessage()}
      />
    </div>
  );
}
