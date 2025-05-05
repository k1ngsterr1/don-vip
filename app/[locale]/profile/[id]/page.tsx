// app/[locale]/profile/[id]/page.tsx
"use client";

import { useAuth } from "@/entities/auth/hooks/queries/use-auth";
import { useProfileEdit } from "@/entities/user/hooks/mutations/use-profile-edit";
import { useProfile } from "@/entities/user/hooks/queries/use-profile";
import { ProfileHeaderEditable } from "@/entities/user/ui/profile-header-editable/profile-header-editable";
import { ProfileMenu } from "@/entities/user/ui/profile-menu/profile-menu";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const { id } = useParams();
  const { isAuthenticated, user: currentUser } = useAuth();
  const { user, isLoading, error } = useProfile(id as string);
  const updateUser = useProfileEdit();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Check if this is the current user's profile
  const isCurrentUserProfile = isAuthenticated && currentUser?.id === id;

  // Handle avatar change
  const handleAvatarChange = (avatarUrl: string) => {
    // Convert data URL to File object
    if (avatarUrl.startsWith("data:")) {
      fetch(avatarUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          setAvatarFile(file);

          // Automatically update the avatar when changed
          updateUser.updateProfile({ avatar: file as any });
        });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="md:max-w-6xl md:mx-auto md:px-8 md:py-8 lg:py-12 flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
      </div>
    );
  }

  // Error state
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
        {/* Left column for desktop - profile header */}
        <div className="md:w-1/3 lg:w-1/4">
          <div className="md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-100 md:p-6">
            {/* Only show editable version if it's the current user's profile */}
            {isCurrentUserProfile ? (
              <ProfileHeaderEditable
                user={user}
                onAvatarChange={handleAvatarChange}
              />
            ) : (
              <ProfileHeaderEditable user={user} />
            )}
          </div>
        </div>

        {/* Right column for desktop - menu */}
        <div className="md:w-2/3 lg:w-3/4">
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}
