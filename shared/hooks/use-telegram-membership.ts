import { useState } from "react";

interface TelegramMembershipResult {
  isMember: boolean;
  status?: string;
  username?: string;
  userId?: number;
  error?: string;
}

export function useTelegramMembership() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TelegramMembershipResult | null>(null);

  const checkMembership = async (
    username: string
  ): Promise<TelegramMembershipResult> => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/telegram/check-membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
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
