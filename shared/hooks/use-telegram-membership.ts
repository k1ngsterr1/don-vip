import { useState } from "react";
import {
  telegramApi,
  type TelegramMembershipResult,
} from "@/entities/telegram/api/telegram.api";

export function useTelegramMembership() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TelegramMembershipResult | null>(null);

  const checkMembership = async (
    username: string
  ): Promise<TelegramMembershipResult> => {
    setIsLoading(true);
    setResult(null);

    try {
      const data = await telegramApi.checkMembership(username);
      setResult(data);
      return data;
    } catch (error) {
      const errorResult = {
        isMember: false,
        error: "Network error or failed to check membership",
      };
      setResult(errorResult);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  };

  const resetResult = () => {
    setResult(null);
  };

  return {
    checkMembership,
    isLoading,
    result,
    resetResult,
  };
}
