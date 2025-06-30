"use client";

import { useProfile } from "@/entities/user/hooks/use-profile";
import { ProfileHeaderEditable } from "@/entities/user/ui/profile-header-editable/profile-header-editable";
import { ProfileMenu } from "@/entities/user/ui/profile-menu/profile-menu";
import { ProfileLoading } from "@/widgets/ui/profile-page/profile-skeleton/profile-skeleton";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function ProfileBlock() {
  const { id } = useParams();

  const { data: user, isLoading, error } = useProfile(id as string);
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
            <ProfileHeaderEditable user={user as any} />
          </div>
        </div>
        <div className="md:w-2/3 lg:w-3/4">
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}
