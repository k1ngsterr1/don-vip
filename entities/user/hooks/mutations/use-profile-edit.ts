// entities/user/hooks/mutations/use-update-profile.ts
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/config/apiClient";
import type { User } from "@/entities/user/model/types";

// Fallback user data in case API fails
const fallbackUser = {
  id: "1",
  firstName: "",
  lastName: "",
  avatar: "",
  gender: "male" as const,
  birthDate: "",
  phone: "",
  email: "",
  socialProvider: "vk" as const,
};

/**
 * Hook for editing user profile with TanStack Query
 */
export function useProfileEdit() {
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Fetch current user data
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const response = await apiClient.get("/user/me");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  // Update profile mutation
  const { mutateAsync: updateProfileMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: async (userData: Partial<User>) => {
        // Create FormData for multipart/form-data
        const formData = new FormData();

        // Map from our frontend model to API fields
        if (userData.firstName)
          formData.append("first_name", userData.firstName);
        if (userData.lastName) formData.append("last_name", userData.lastName);
        if (userData.gender) formData.append("gender", userData.gender);
        if (userData.birthDate)
          formData.append("birth_date", userData.birthDate);
        if (userData.phone) formData.append("phone", userData.phone);

        // Add avatar if available
        if (avatarFile) {
          formData.append("avatar", avatarFile);
        }

        const response = await apiClient.patch(
          "/user/update-profile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data;
      },
      onSuccess: () => {
        // Invalidate and refetch user queries
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
      onError: (error) => {},
    });

  // Handle avatar change
  const handleAvatarChange = (avatarUrl: string) => {
    // Convert data URL to File object
    if (avatarUrl.startsWith("data:")) {
      fetch(avatarUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          setAvatarFile(file);
        });
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>) => {
    try {
      await updateProfileMutation(userData);
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return {
    user: user || fallbackUser,
    isLoading: isUserLoading || isUpdating,
    handleAvatarChange,
    updateProfile,
    avatarFile,
  };
}
