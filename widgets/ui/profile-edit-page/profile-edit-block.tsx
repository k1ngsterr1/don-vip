"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { ProfileEditForm } from "@/entities/user/ui/profile-edit-form/profile-edit-form";
import { ProfileHeaderEditable } from "@/entities/user/ui/profile-header-editable/profile-header-editable";
import { ProfileEditSkeleton } from "./profile-edit-skeleton/profile-edit-skeleton";
import {
  useUpdateProfile,
  useUploadAvatar,
} from "@/entities/user/hooks/use-user.mutation";
import { userApi } from "@/entities/user/auth/user-api";
import { useTranslations } from "next-intl";
import { authApi } from "@/entities/auth/api/auth.api";

export function ProfileEditClient() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const t = useTranslations("profileEdit");

  const {
    data: user,
    isLoading,
    error: userError,
    refetch,
  } = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const data = await authApi.getCurrentUser();

      // Update auth store with fetched data
      if (data) {
        setUser(data);
      }

      return data;
    },
    staleTime: 0, // Always fetch fresh data
    retry: 1,
  });

  // Handle avatar change
  const handleAvatarChange = async (file: File) => {
    try {
      await uploadAvatarMutation.mutateAsync(file);
      refetch(); // Refetch user data after avatar update
      return true;
    } catch (error) {
      return false;
    }
  };

  // Handle profile update
  const updateProfile = async (data: any, redirectPath?: string) => {
    try {
      await updateProfileMutation.mutateAsync(data);

      // Refetch user data
      await refetch();

      // Redirect if path provided
      // if (redirectPath) {
      //   router.push(redirectPath);
      // }

      return true;
    } catch (error) {
      return false;
    }
  };

  // Combined loading state
  const isPageLoading =
    isLoading ||
    updateProfileMutation.isPending ||
    uploadAvatarMutation.isPending;

  // Show loading state
  if (isPageLoading || !user) {
    return <ProfileEditSkeleton />;
  }

  // Show error state
  if (userError) {
    return (
      <div className="px-4 md:px-8 lg:px-0 md:max-w-4xl md:mx-auto md:py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-2">
            Error loading profile data
          </h2>
          <p>
            {userError instanceof Error
              ? userError.message
              : "Failed to load user data"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="px-4 md:px-8 lg:px-0 md:max-w-4xl md:mx-auto md:py-8">
      <div className="md:bg-white md:shadow-md md:rounded-xl md:p-8 md:border md:border-gray-100">
        <div className="md:flex md:items-start">
          <div className="md:w-1/3 md:pr-8 md:border-r md:border-gray-100">
            <ProfileHeaderEditable
              user={user}
              onAvatarChange={handleAvatarChange as any}
            />
          </div>
          <div className="md:w-2/3 md:pl-8">
            <h2 className="hidden md:block text-2xl font-unbounded font-medium mb-6 text-gray-800">
              {t("editProfile")}
            </h2>
            <ProfileEditForm
              user={user as any}
              onSubmit={updateProfile}
              redirectAfterSubmit={`/profile/${user.id}`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
