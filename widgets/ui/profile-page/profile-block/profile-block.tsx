"use client";

import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useProfile } from "@/entities/user/hooks/use-profile";
import { useUpdateUser } from "@/entities/user/hooks/use-update-user";
import { ProfileHeaderEditable } from "@/entities/user/ui/profile-header-editable/profile-header-editable";
import { ProfileMenu } from "@/entities/user/ui/profile-menu/profile-menu";
import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { ProfileLoading } from "@/widgets/ui/profile-page/profile-skeleton/profile-skeleton";
import { useParams } from "next/navigation";
import React from "react";

export default function ProfileBlock() {
  const { id } = useParams();
  const { isAuthenticated, user: currentUser } = useAuthStore();
  const { data: user, isLoading, error, refetch } = useProfile(id as string);
  const updateUser = useUpdateUser();

  const isCurrentUserProfile =
    isAuthenticated && currentUser?.id?.toString() === id?.toString();

  const handleAvatarChange = async (avatarUrl: string) => {
    if (!avatarUrl) return;

    try {
      if (avatarUrl.startsWith("data:")) {
        const res = await fetch(avatarUrl);
        const blob = await res.blob();
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

        await updateUser.mutateAsync({ avatar: file });
        await refetch();
      } else if (avatarUrl.startsWith("http")) {
        console.log("Using existing avatar URL:", avatarUrl);
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  if (isLoading) {
    return <ProfileLoading />;
  }

  if (error) {
    return (
      <div className="md:max-w-6xl md:mx-auto md:px-8 md:py-8 lg:py-12">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          <h3 className="font-medium">Error loading profile</h3>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:max-w-6xl md:mx-auto md:px-8 md:py-8 lg:py-12">
      <div className="md:flex md:gap-8 lg:gap-12">
        <div className="md:w-1/3 lg:w-1/4">
          <div className="md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-100 md:p-6">
            <ProfileHeaderEditable
              user={user as any}
              onAvatarChange={handleAvatarChange as any}
            />
          </div>
        </div>
        <div className="md:w-2/3 lg:w-3/4">
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}
