"use client";

import { useState } from "react";
import { bigoService } from "../api/bigo.api";

interface ValidationResult {
  isValid: boolean;
  username?: string;
  vipStatus?: string;
  errorMessage?: string;
  errorCode?: number;
}

interface UseValidateBigoUserResult {
  validateUser: (userId: string) => Promise<ValidationResult>;
  isValidating: boolean;
  error: string | null;
  errorCode: number | null;
}

export function useValidateBigoUser(): UseValidateBigoUserResult {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  const validateUser = async (userId: string): Promise<ValidationResult> => {
    setIsValidating(true);
    setError(null);
    setErrorCode(null);

    try {
      const response = await bigoService.validateUserId(userId);

      if (!response.success) {
        const errorMessage = response.error || "ID не существвует";
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
        username: response.data?.username,
        vipStatus: response.data?.userInfo?.vipStatus,
      };
    } catch (err) {
      const errorMessage = "Failed to validate user ID";
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
