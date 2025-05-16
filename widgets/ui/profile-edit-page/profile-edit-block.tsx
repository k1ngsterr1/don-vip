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

export function ProfileEditClient() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  // Directly fetch user data with useQuery
  const {
    data: user,
    isLoading,
    error: userError,
    refetch,
  } = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      console.log("Fetching user data directly in ProfileEditClient");
      const data = await userApi.getCurrentUser();
      console.log("User data fetched:", data);

      // Update auth store with fetched data
      if (data) {
        setUser(data);
      }

      return data;
    },
    staleTime: 0, // Always fetch fresh data
    retry: 1,
  });

  // Log component state
  useEffect(() => {
    console.log("ProfileEditClient state:", {
      user,
      isLoading,
      hasError: !!userError,
      updatePending: updateProfileMutation.isPending,
      uploadPending: uploadAvatarMutation.isPending,
    });
  }, [
    user,
    isLoading,
    userError,
    updateProfileMutation.isPending,
    uploadAvatarMutation.isPending,
  ]);

  // Handle avatar change
  const handleAvatarChange = async (file: File) => {
    try {
      console.log("Uploading avatar in ProfileEditClient");
      await uploadAvatarMutation.mutateAsync(file);
      refetch(); // Refetch user data after avatar update
      return true;
    } catch (error) {
      console.error("Avatar upload failed:", error);
      return false;
    }
  };

  // Handle profile update
  const updateProfile = async (data: any, redirectPath?: string) => {
    try {
      console.log("Updating profile in ProfileEditClient:", data);
      await updateProfileMutation.mutateAsync(data);

      // Refetch user data
      await refetch();

      // Redirect if path provided
      // if (redirectPath) {
      //   router.push(redirectPath);
      // }

      return true;
    } catch (error) {
      console.error("Profile update failed:", error);
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
      {/* Desktop background decorative elements - only visible on desktop */}
      <div className="hidden md:block absolute top-0 right-0 w-1/3 h-64 bg-blue-50 opacity-50 -z-10"></div>
      <div className="hidden md:block absolute top-64 left-0 w-1/4 h-96 bg-blue-50 opacity-50 -z-10"></div>

      {/* Desktop card container - only visible on desktop */}
      <div className="md:bg-white md:shadow-md md:rounded-xl md:p-8 md:border md:border-gray-100">
        <div className="md:flex md:items-start">
          {/* Left column with header on desktop */}
          <div className="md:w-1/3 md:pr-8 md:border-r md:border-gray-100">
            <ProfileHeaderEditable
              user={user}
              onAvatarChange={handleAvatarChange as any}
            />
          </div>
          <div className="md:w-2/3 md:pl-8">
            <h2 className="hidden md:block text-2xl font-unbounded font-medium mb-6 text-gray-800">
              Редактирование профиля
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
