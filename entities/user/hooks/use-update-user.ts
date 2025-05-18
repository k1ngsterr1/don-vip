"use client";

import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../auth/user-api";
import { queryKeys } from "@/shared/config/queryKeys";
import { extractErrorMessage } from "@/shared/config/apiClient";

/**
 * Hook for updating user data including avatar
 *
 * @returns Mutation object and helper methods
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  // Mutation for updating profile data
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => {
      if (!user?.id) throw new Error("User ID is required");
      return userApi.updateProfile(user.id, data);
    },
    onSuccess: (updatedUser) => {
      // Update auth store
      setUser(updatedUser);

      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(updatedUser.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });

  // Mutation for uploading avatar
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => userApi.uploadAvatar(file),
    onSuccess: (updatedUser) => {
      // Update auth store
      setUser(updatedUser);

      // Invalidate queries
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.detail(user.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });

  // Combined mutation function
  const mutate = async (data: any) => {
    try {
      // If data contains a File object for avatar, use the avatar upload mutation
      if (data.avatar instanceof File) {
        const file = data.avatar;
        delete data.avatar; // Remove avatar from data object

        // If there are other fields to update
        if (Object.keys(data).length > 0) {
          await updateProfileMutation.mutateAsync(data);
        }

        // Upload avatar
        return await uploadAvatarMutation.mutateAsync(file);
      } else {
        // Regular profile update
        return await updateProfileMutation.mutateAsync(data);
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    mutate,
    mutateAsync: mutate,
    isPending:
      updateProfileMutation.isPending || uploadAvatarMutation.isPending,
    isError: updateProfileMutation.isError || uploadAvatarMutation.isError,
    error: updateProfileMutation.error || uploadAvatarMutation.error,
    isSuccess:
      updateProfileMutation.isSuccess || uploadAvatarMutation.isSuccess,
    reset: () => {
      updateProfileMutation.reset();
      uploadAvatarMutation.reset();
    },
  };
}
