"use client";

import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { type UpdateProfilePayload, userApi } from "../auth/user-api";
import { queryKeys } from "@/shared/config/queryKeys";
import { extractErrorMessage } from "@/shared/config/apiClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => {
      if (!user?.id) throw new Error("User ID is required");
      return userApi.updateProfile(user.id, data);
    },
    onSuccess: (updatedUser) => {
      // Update auth store with new user data
      setUser(updatedUser);

      // Invalidate user queries to refetch data
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(updatedUser.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
}

/**
 * Hook for uploading user avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: userApi.uploadAvatar,
    onSuccess: (updatedUser) => {
      // Update auth store with new user data
      setUser(updatedUser);

      // Invalidate user queries to refetch data
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.detail(user.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
}

/**
 * Hook for deleting user avatar
 */
export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      if (!user?.id) throw new Error("User ID is required");
      return userApi.deleteAvatar(user.id);
    },
    onSuccess: (updatedUser) => {
      // Update auth store with new user data
      setUser(updatedUser);

      // Invalidate user queries to refetch data
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(updatedUser.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
}

/**
 * Combined hook for profile editing functionality
 */
export function useProfileEdit() {
  const router = useRouter();
  const { user: authUser, setUser } = useAuthStore();
  const [isInitiallyLoading, setIsInitiallyLoading] = useState(true);
  const {
    data: fetchedUser,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery<any>({
    queryKey: queryKeys.auth.user,
    queryFn: userApi.getCurrentUser,
    enabled: !!authUser?.id,
  });

  // Use either the freshly fetched user or the auth store user
  const user = fetchedUser || authUser;

  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  // Function to handle avatar change
  const handleAvatarChange = async (file: File) => {
    try {
      await uploadAvatarMutation.mutateAsync(file);
      return true;
    } catch (error) {
      console.error("Failed to upload avatar:", extractErrorMessage(error));
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
        router.push(redirectPath);
      }

      return true;
    } catch (error) {
      console.error("Failed to update profile:", extractErrorMessage(error));
      return false;
    }
  };

  // Combined loading state
  const isLoading =
    isInitiallyLoading ||
    isUserLoading ||
    updateProfileMutation.isPending ||
    uploadAvatarMutation.isPending;

  return {
    user,
    isLoading,
    updateProfile,
    handleAvatarChange,
    updateProfileError: updateProfileMutation.error,
    updateAvatarError: uploadAvatarMutation.error,
    userError,
  };
}
