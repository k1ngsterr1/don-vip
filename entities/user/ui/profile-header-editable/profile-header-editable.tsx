"use client";

import type React from "react";

import type { User } from "@/entities/user/model/types";
import { Camera, Copy, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ProfileHeaderEditableProps {
  user: User;
  onAvatarChange?: (avatarUrl: string) => void;
}

export function ProfileHeaderEditable({
  user,
  onAvatarChange,
}: ProfileHeaderEditableProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fullName = `${user.firstName} ${user.lastName}`;

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result as string;
        setAvatarUrl(newAvatarUrl);

        if (onAvatarChange) {
          onAvatarChange(newAvatarUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center py-6 md:py-4">
      <div
        className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-3 cursor-pointer group"
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
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload size={24} className="text-white" />
            </div>
          </>
        ) : (
          <div className="w-full h-full border-2 border-blue rounded-full flex items-center justify-center bg-gray-50 md:shadow-inner">
            <Camera
              size={32}
              className="text-gray-400 md:text-gray-500 md:w-10 md:h-10"
            />
          </div>
        )}

        {/* Desktop-only upload button */}
        <div className="hidden md:flex absolute bottom-0 right-0 bg-blue text-white w-8 h-8 rounded-full items-center justify-center shadow-md cursor-pointer hover:bg-blue-600 transition-colors">
          <Upload size={16} />
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload avatar"
      />

      <div className="text-center md:mt-2">
        <div className="text-sm text-gray-500 mb-1 md:flex md:items-center md:justify-center">
          <span className="md:text-xs md:bg-gray-100 md:px-2 md:py-1 md:rounded-full">
            Don-Vip ID: {user.id}
          </span>
          <button className="ml-1 text-gray-400 md:ml-2">
            <Copy
              className="text-[#383838] md:hover:text-blue transition-colors"
              size={9}
            />
          </button>
        </div>
        <h1 className="text-xl font-medium md:text-2xl md:mt-2">{fullName}</h1>
      </div>

      {/* Desktop-only additional info */}
      <div className="hidden md:block mt-6 w-full">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">Последнее обновление профиля:</p>
          <p className="text-sm font-medium">15 апреля 2025</p>
        </div>
      </div>

      {/* Desktop-only edit button */}
      <div className="hidden md:block mt-6 w-full">
        <a
          href="/profile/1/edit"
          className="block w-full py-3 bg-blue text-white text-center rounded-lg hover:bg-blue-600 transition-colors"
        >
          Редактировать профиль
        </a>
      </div>
    </div>
  );
}
