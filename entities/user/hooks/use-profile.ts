"use client";

import { useAuthStore } from "@/entities/auth/store/auth.store";
import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../auth/user-api";

/**
 * Hook to fetch and manage user profile data
 *
 * @param userId The ID of the user to fetch
 * @returns User profile data and query state
 */
export function useProfile(userId: string | number) {
  const { user: currentUser } = useAuthStore();
  const isCurrentUser = currentUser?.id?.toString() === userId?.toString();

  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => userApi.getUserById(userId),
    // If it's the current user's profile, we can use the data from auth store
    // as initial data to avoid loading flicker
    initialData: isCurrentUser ? currentUser : undefined,
    staleTime: isCurrentUser
      ? 1 * 60 * 1000 // 1 minute for current user (more frequent updates)
      : 5 * 60 * 1000, // 5 minutes for other users
  });
}
