"use client";

import { queryKeys } from "@/shared/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../auth/user-api";
import { User } from "../model/types";

/**
 * Hook to fetch a user profile by ID
 *
 * @param userId The user ID to fetch
 * @param options Additional query options
 * @returns User profile data and query state
 */
export function useUserProfile(
  userId: string | number | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: userId
      ? queryKeys.users.detail(userId)
      : queryKeys.users.details(),
    queryFn: () => userApi.getUserById(userId as string | number),
    enabled: !!userId && options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get user profiles for multiple user IDs
 *
 * @param userIds Array of user IDs to fetch
 * @returns Object mapping user IDs to their profile data and query state
 */
export function useUserProfiles(userIds: (string | number)[]) {
  return useQuery({
    queryKey: [...queryKeys.users.lists(), { ids: userIds }],
    queryFn: async () => {
      if (userIds.length === 0) return {};

      const profiles = await userApi.getUsersByIds(userIds);

      // Create a map of user ID to profile
      return profiles.reduce((acc, profile) => {
        if (profile && profile.id) {
          acc[profile.id] = profile;
        }
        return acc;
      }, {} as Record<string | number, User>);
    },
    enabled: userIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
