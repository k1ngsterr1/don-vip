"use client";

import { useState } from "react";
import { smileService } from "../api/smile.api";

interface ValidationResult {
  isValid: boolean;
  username?: string;
  userAccount?: {
    user_id: string;
    server_id: string;
  };
  errorMessage?: string;
  errorCode?: number;
  // Note: Smile validation doesn't have vipStatus
}

interface UseValidateSmileUserResult {
  validateUser: (
    userId: string,
    serverId: string,
    apiGame?: string
  ) => Promise<ValidationResult>;
  isValidating: boolean;
  error: string | null;
  errorCode: number | null;
}

export function useValidateSmileUser(): UseValidateSmileUserResult {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  const validateUser = async (
    userId: string,
    serverId: string,
    apiGame = "mobilelegendsru"
  ): Promise<ValidationResult> => {
    setIsValidating(true);
    setError(null);
    setErrorCode(null);

    try {
      const response = await smileService.validateUserId(
        userId,
        serverId,
        apiGame
      );

      if (!response.success) {
        const errorMessage =
          response.error || "User ID or Server ID does not exist";
        setError(errorMessage);
        setErrorCode(response.errorCode || null);

        return {
          isValid: false,
          errorMessage,
          errorCode: response.errorCode,
        };
      }

      return {
        isValid: true,
        username: response.data?.nickname,
        userAccount: {
          user_id: userId,
          server_id: serverId,
        },
      };
    } catch (err) {
      const errorMessage = "Failed to validate user ID and server ID";
      setError(errorMessage);

      return {
        isValid: false,
        errorMessage,
      };
    } finally {
      setIsValidating(false);
    }
  };

  return {
    validateUser,
    isValidating,
    error,
    errorCode,
  };
}
