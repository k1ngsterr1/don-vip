import { apiClient } from "@/shared/config/apiClient";

export interface TelegramMembershipResult {
  isMember: boolean;
  status?: string;
  username?: string;
  userId?: number;
  error?: string;
}

export const telegramApi = {
  /**
   * Check if user is a member of Telegram channel
   */
  checkMembership: async (
    username: string
  ): Promise<TelegramMembershipResult> => {
    const response = await apiClient.post<TelegramMembershipResult>(
      "/telegram/check-membership",
      {
        username,
      }
    );
    return response.data;
  },
};
