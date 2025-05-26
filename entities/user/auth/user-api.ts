import type { User } from "@/entities/user/model/types";
import { apiClient } from "@/shared/config/apiClient";

// Types
export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  birth_date?: string;
  email?: string;
  telegramUsername?: string;
  country?: string;
  city?: string;
}

function formatBirthDateToISO(date: string): string {
  if (date.includes(".")) {
    const [day, month, year] = date.split(".");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return date; // если уже в ISO
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
  getUserById: async (userId: string | number): Promise<User> => {
    const response = await apiClient.get<User>(`/user/${userId}`);
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

  verify: async (data: any): Promise<User> => {
    const response = await apiClient.post<User>(`/user/verify`, data);
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

    const response = await apiClient.patch<User>(
      `/user/update-profile`,
      payload
    );
    return response.data;
  },

  /**
   * Upload user ]
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
    const response = await apiClient.delete<User>(`/user/${userId}/avatar`);
    return response.data;
  },
};
