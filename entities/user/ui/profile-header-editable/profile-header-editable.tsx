"use client";

import type React from "react";
import type { User } from "@/entities/user/model/types";
import { useUpdateUser } from "@/entities/user/hooks/use-update-user";
import { Camera, Copy, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface ProfileHeaderEditableProps {
  user: User;
  onAvatarChange?: (file: File) => Promise<void>;
  readOnly?: boolean;
}

export function ProfileHeaderEditable({
  user,
  onAvatarChange,
  readOnly = false,
}: ProfileHeaderEditableProps) {
  const i18n = useTranslations("profileEdit");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatar);
  const [isUploading, setIsUploading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fullName = `${user.firstName} ${user.lastName}`;

  // Use our standardized hook if no custom handler is provided
  const updateUser = useUpdateUser();

  // Replace the handleAvatarChange function with this updated version that handles File objects
  const handleAvatarChange = async (input: File | string) => {
    try {
      console.log("Avatar change initiated:", input);

      let file: File;

      // Handle different input types
      if (input instanceof File) {
        // If already a File object, use it directly
        file = input;
        console.log("Input is already a File object");
      } else if (typeof input === "string") {
        // If it's a string URL
        if (input.startsWith("data:")) {
          // Convert data URL to File object
          const res = await fetch(input);
          const blob = await res.blob();
          file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          console.log("Data URL converted to file, uploading...");
        } else if (input.startsWith("http")) {
          // If it's already a URL (not a data URL), just use it directly
          console.log("Using existing avatar URL:", input);
          return; // No need to upload in this case
        } else {
          console.error("Unsupported URL format");
          return;
        }
      } else {
        console.error("Unsupported input type for avatar change");
        return;
      }

      // Update the avatar
      await updateUser.mutateAsync({ avatar: file });

      // Refetch user data to get updated avatar URL
      // Note: You'll need to implement refetch or adjust this part
      // as the original component doesn't have refetch

      console.log("Avatar updated successfully");
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const handleAvatarClick = () => {
    if (readOnly || isUploading) return;

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Update the handleFileChange function to pass the file directly
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Show preview immediately for better UX
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setAvatarUrl(previewUrl);
      };
      reader.readAsDataURL(file);

      // Call the provided onAvatarChange or our custom handler
      if (onAvatarChange) {
        await onAvatarChange(file);
      } else {
        // Use the custom handler with the file object directly
        await handleAvatarChange(file);
      }
    } catch (error) {
      console.error(i18n("errorUploading"), error);
      // Revert to original avatar on error
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

      // Use provided handler or default to our hook
      if (onAvatarChange) {
        // Pass null to indicate avatar removal
        await onAvatarChange(null as any);
      } else {
        await updateUser.mutateAsync({ avatar: null });
      }
    } catch (error) {
      console.error(i18n("errorRemoving"), error);

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
    <div className="flex flex-col items-center py-6 md:py-4">
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
              alt={fullName}
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
        <div className="text-sm text-gray-500 mb-1 md:flex md:items-center md:justify-center">
          <span className="md:text-xs md:bg-gray-100 md:px-2 md:py-1 md:rounded-full">
            {i18n("userId")}: {user.id}
          </span>
          <button
            className="ml-1 text-gray-400 md:ml-2"
            onClick={copyToClipboard}
            title={i18n("copyId")}
          >
            <Copy
              className="text-[#383838] md:hover:text-blue transition-colors"
              size={9}
            />
          </button>
        </div>
        <h1 className="text-xl font-medium md:text-2xl md:mt-2">
          {fullName != undefined ? "" : fullName}
        </h1>
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
