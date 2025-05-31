import { useAuthStore } from "@/entities/auth/store/auth.store";
import type { User } from "@/entities/user/model/types";
import { apiClient } from "@/shared/config/apiClient";
import { getUserId } from "@/shared/hooks/use-get-user-id";

// Types
export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  bio?: string;
  phone?: string;
  birth_date?: string;
  email?: string;
  telegramUsername?: string;
  country?: string;
  city?: string;
  gender?: string;
}

// Added ResendCodePayload interface to match backend DTO
export interface ResendCodePayload {
  identifier: string;
  lang: "ru" | "en"; // Or your Language enum if defined client-side
}

// Reset password with token payload
export interface ResetPasswordWithTokenPayload {
  new_password: string;
  token: string;
}

// Reset password response
export interface ResetPasswordResponse {
  id: string;
  identifier: string;
  role: string;
}

function formatBirthDateToISO(date: string): string {
  if (!date) return ""; // Handle cases where date might be undefined or empty
  if (date.includes(".")) {
    const parts = date.split(".");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
  return date; // if already in ISO or different format not handled
}

/**
 * User API client for user-related operations
 */
export const userApi = {
  /**
   * Get the current authenticated user's profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/user/me");
    return response.data;
  },

  /**
   * Get a user profile by ID
   */
  getUserById: async (userId?: string | number): Promise<User> => {
    let id = userId;

    if (!id) {
      id = await getUserId();
    } else {
      console.log("[userApi.getUserById] Using provided userId:", id);
    }

    const { isGuestAuth } = useAuthStore.getState();

    const endpoint = isGuestAuth
      ? `/user/guest-profile/${id}`
      : `/user/profile/${id}`;

    console.log("[userApi.getUserById] Fetching endpoint:", endpoint);

    const response = await apiClient.get<User>(endpoint);
    if (!response.data) {
      console.error("[userApi.getUserById] User not found for id:", id);
      throw new Error("User not found");
    }
    console.log("[userApi.getUserById] User data received:", response.data);
    return response.data;
  },

  /**
   * Get multiple user profiles by IDs
   */
  getuserByIds: async (userIds: (string | number)[]): Promise<User[]> => {
    const response = await apiClient.post<User[]>("/user/batch", {
      ids: userIds,
    });
    return response.data;
  },

  /**
   * Verify user with a code
   */
  verify: async (data: { identifier: string; code: string }): Promise<User> => {
    const response = await apiClient.post<User>(`/user/verify`, data);
    return response.data;
  },

  /**
   * Resend verification code
   */
  resendVerificationCode: async (
    data: ResendCodePayload
  ): Promise<{ message: string }> => {
    // The endpoint should match your NestJS controller, e.g., '/auth/resend-code' or '/user/resend-code'
    // Based on your NestJS controller, it was @Post('resend-code') likely under an /auth prefix.
    // Adjust if your user module handles this.
    const response = await apiClient.post<{ message: string }>(
      `/auth/resend-code`,
      data
    );
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    userId: string | number,
    data: UpdateProfilePayload
  ): Promise<User> => {
    const payload = {
      ...data,
      birth_date: data.birth_date
        ? formatBirthDateToISO(data.birth_date)
        : undefined,
    };

    // Assuming updateProfile should also be under /user, not /user/update-profile if it uses user's own context
    // Or if it requires an ID, it might be /user/${userId}/update-profile
    // For now, using a generic /user/update-profile which implies the backend knows the user from auth context
    const response = await apiClient.patch<User>(
      `/user/update-profile`,
      payload
    );
    return response.data;
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiClient.post<User>(
      "/user/upload-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  /**
   * Delete user avatar
   */
  deleteAvatar: async (userId: string | number): Promise<User> => {
    // Endpoint might be /user/avatar if it operates on the authenticated user
    // or /user/${userId}/avatar if admin operation or specific user context.
    // Assuming it operates on the authenticated user for simplicity.
    const response = await apiClient.delete<User>(`/user/avatar`);
    return response.data;
  },

  /**
   * Reset password using a token from email link
   */
  resetPasswordWithToken: async (
    data: ResetPasswordWithTokenPayload
  ): Promise<ResetPasswordResponse> => {
    const response = await apiClient.post<ResetPasswordResponse>(
      "/user/reset-password",
      { new_password: data.new_password },
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    return response.data;
  },
};
