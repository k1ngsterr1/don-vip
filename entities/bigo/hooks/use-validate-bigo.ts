"use client";

import { useState } from "react";
import { productService } from "@/entities/product/api/product.api";

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
      const response = await productService.validateBigoUser(userId);

      // Handle DonatBank response format
      if (response.status === 'success' && response.nickname) {
        return {
          isValid: true,
          username: response.nickname,
        };
      }

      // Handle Smile service response format  
      if (response.success) {
        return {
          isValid: true,
          username: response.data?.username,
          vipStatus: response.data?.userInfo?.vipStatus,
        };
      }

      // Handle fallback success cases (when validation is disabled)
      if (response.message === 'success' || response.status === 'success') {
        return {
          isValid: true,
          username: response.nickname || response.data?.username || 'Unknown User',
        };
      }

      // Handle error cases
      const errorMessage = response.error || response.message || "ID не существвует";
      setError(errorMessage);
      setErrorCode(response.errorCode || null);

      return {
        isValid: false,
        errorMessage,
        errorCode: response.errorCode,
      };
    } catch (err: any) {
      const errorMessage = err.message || "Failed to validate user ID";
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
