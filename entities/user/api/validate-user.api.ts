import { apiClient } from "@/shared/config/apiClient";

export interface ValidateUserRequest {
  userId: string;
  gameId: number;
  zoneId?: string;
}

export interface ValidateUserResponse {
  status: "success" | "failed";
  message: string;
  nickname?: string | null;
  validated: boolean;
}

/**
 * Validate user in game via backend API
 */
export const validateUser = async (
  data: ValidateUserRequest
): Promise<ValidateUserResponse> => {
  const response = await apiClient.post<ValidateUserResponse>(
    "/user/validate-user",
    data
  );
  return response.data;
};
