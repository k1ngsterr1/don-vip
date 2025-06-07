import { apiClient } from "@/shared/config/apiClient";
import type { BanksResponse } from "../model/types";

export const bankApi = {
  getActiveBanks: async (): Promise<BanksResponse> => {
    // Assuming page 1 and a high enough limit to get all active banks,
    // or your API supports fetching all active ones without pagination if isActive=true
    const response = await apiClient.get<BanksResponse>(
      "/banks?isActive=true&limit=100"
    ); // Adjust limit as needed
    return response.data;
  },
};
