"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/config/apiClient";
import type { User } from "@/entities/user/model/types";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useGetMe } from "@/entities/auth/hooks/use-auth";
import { useRouter } from "@/i18n/routing";

// Type for profile update payload
interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  email?: string;
  telegramUsername?: string;
  country?: string;
  city?: string;
}

// Function to update user profile
const updateUserProfile = async (
  userId: string | number,
  data: UpdateProfilePayload
): Promise<User> => {
  const response = await apiClient.patch<User>(`/users/${userId}`, data);
  return response.data;
};

// Function to update just the user avatar
export const updateUserAvatar = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await apiClient.post<User>("/user/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Hook for profile editing functionality
export function useProfileEdit() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetMe();
  const { setUser } = useAuthStore();

  // Local state for user data
  const [userData, setUserData] = useState<User | null>(null);

  // Update local state when user data is loaded
  useEffect(() => {
    if (user && !isLoading) {
      setUserData(user as any);
    }
  }, [user, isLoading]);

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfilePayload) => {
      if (!user?.id) throw new Error("User ID is required");
      return updateUserProfile(user.id, data);
    },
    onSuccess: (updatedUser) => {
      // Update auth store with new user data
      setUser(updatedUser);

      // Invalidate user queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  // Mutation for updating avatar
  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => {
      return updateUserAvatar(file);
    },
    onSuccess: (updatedUser) => {
      // Update auth store with new user data
      setUser(updatedUser);

      // Invalidate user queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  // Function to handle avatar change
  const handleAvatarChange = async (avatarUrl: string) => {
    try {
      // Convert base64 to File object
      const response = await fetch(avatarUrl);
      const blob = await response.blob();

      // Create a File from the blob
      const file = new File([blob], "avatar.jpg", { type: blob.type });

      // Upload the file
      await updateAvatarMutation.mutateAsync(file);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Function to update profile
  const updateProfile = async (
    data: UpdateProfilePayload,
    redirectPath?: string
  ) => {
    try {
      await updateProfileMutation.mutateAsync(data);

      // Redirect after successful update if path is provided
      if (redirectPath) {
        router.push(redirectPath as any);
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    user: userData,
    isLoading:
      isLoading ||
      updateProfileMutation.isPending ||
      updateAvatarMutation.isPending,
    updateProfile,
    handleAvatarChange,
    updateProfileError: updateProfileMutation.error,
    updateAvatarError: updateAvatarMutation.error,
  };
}
