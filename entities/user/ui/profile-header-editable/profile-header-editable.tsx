"use client";

import type React from "react";
import type { User } from "@/entities/user/model/types";
import { useUpdateUser } from "@/entities/user/hooks/use-update-user";
import { Camera, CheckCircle, Copy, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { updateUserAvatar } from "../../hooks/mutations 01-53-42-528/use-update-profile.mutation";

interface ProfileHeaderEditableProps {
  user: User;
  onAvatarChange?: (file: File) => Promise<void>;
  readOnly?: boolean;
}

export function ProfileHeaderEditable({
  user,
  readOnly = false,
}: ProfileHeaderEditableProps) {
  const i18n = useTranslations("profileEdit");
  const i18nHeader = useTranslations("profile-header-editable");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatar);
  const [isUploading, setIsUploading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use our standardized hook if no custom handler is provided
  const updateUser = useUpdateUser();

  // Replace the handleAvatarChange function with this updated version that handles File objects
  const handleAvatarChange = async (input: File | string) => {
    try {
      let file: File;

      // Handle different input types
      if (input instanceof File) {
        // If already a File object, use it directly
        file = input;
      } else if (typeof input === "string") {
        // If it's a string URL
        if (input.startsWith("data:")) {
          // Convert data URL to File object
          const res = await fetch(input);
          const blob = await res.blob();
          file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        } else if (input.startsWith("http")) {
          // If it's already a URL (not a data URL), just use it directly
          return; // No need to upload in this case
        } else {
          return;
        }
      } else {
        return;
      }

      const updatedUser = await updateUserAvatar(file);
      setAvatarUrl(updatedUser.avatar);
    } catch (error) {}
  };

  const handleAvatarClick = () => {
    if (readOnly || isUploading) return;

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setAvatarUrl(previewUrl);
      };
      reader.readAsDataURL(file);

      await handleAvatarChange(file);
    } catch (error) {
      setAvatarUrl(user.avatar);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (readOnly || isUploading || !avatarUrl) return;

    try {
      setIsUploading(true);

      // Preview removal immediately
      setAvatarUrl(undefined);
    } catch (error) {
      // Revert to original avatar on error
      setAvatarUrl(user.avatar);
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.id.toString());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="flex flex-col items-center py-6 md:py-4 w-full">
      <div
        className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-3 ${
          readOnly ? "" : "cursor-pointer"
        } group`}
        onClick={handleAvatarClick}
      >
        {avatarUrl ? (
          <>
            <Image
              src={avatarUrl || "/placeholder.svg"}
              alt={user.first_name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
            {!readOnly && (
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Upload size={24} className="text-white" />
                )}
              </div>
            )}
            {!readOnly && avatarUrl && (
              <button
                onClick={handleRemoveAvatar}
                className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={i18n("removeAvatar")}
                title={i18n("removeAvatar")}
              >
                <X size={14} />
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full border-2 border-blue rounded-full flex items-center justify-center bg-gray-50 md:shadow-inner">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue"></div>
            ) : (
              <Camera
                size={32}
                className="text-gray-400 md:text-gray-500 md:w-10 md:h-10"
              />
            )}
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        aria-label={i18n("uploadAvatar")}
        disabled={isUploading || readOnly}
      />
      <div className="text-center md:mt-2">
        <div className="text-sm text-gray-500 mb-1 md:flex md:items-center md:justify-center relative">
          <span className="md:text-xs md:bg-gray-100 md:px-2 md:py-1 md:rounded-full">
            {i18n("userId")}: {user.id}
          </span>
          <button
            className="ml-1 text-gray-400 md:ml-2 relative"
            onClick={copyToClipboard}
            title={i18n("copyId")}
          >
            {copySuccess ? (
              <CheckCircle className="text-green-500" size={14} />
            ) : (
              <Copy
                className="text-[#383838] md:hover:text-blue transition-colors"
                size={9}
              />
            )}
          </button>
          {copySuccess && (
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap animate-fade-in">
              {i18n("copied")}
            </span>
          )}
        </div>
        {user.first_name && (
          <h1 className="text-xl font-medium md:text-2xl md:mt-2">
            {user.first_name} {user.last_name}
          </h1>
        )}
      </div>
      <div className="hidden md:block mt-6 w-full">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">{i18n("lastUpdate")}:</p>
          <p className="text-sm font-medium">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
      {!readOnly && (
        <div className="hidden md:block mt-6 w-full">
          <a
            href={`/profile/${user.id}/edit/`}
            className="block w-full py-3 bg-blue text-white text-center rounded-lg hover:bg-blue-600 transition-colors"
          >
            {i18n("editProfile")}
          </a>
        </div>
      )}
    </div>
  );
}
