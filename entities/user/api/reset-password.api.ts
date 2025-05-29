import { apiClient } from "@/shared/config/apiClient";

export interface ResetPasswordWithTokenPayload {
  new_password: string;
  token: string;
}

export interface ResetPasswordResponse {
  id: string;
  identifier: string;
  role: string;
}

/**
 * Reset password using a token from email link
 */
export const resetPasswordWithToken = async (
  data: ResetPasswordWithTokenPayload
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>(
    "/auth/reset-password",
    data
  );
  return response.data;
};
