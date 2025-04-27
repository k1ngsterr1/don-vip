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
    <div className="flex flex-col items-center py-6">
      <div
        className="relative w-24 h-24 rounded-full overflow-hidden mb-3 cursor-pointer"
        onClick={handleAvatarClick}
      >
        {avatarUrl ? (
          <>
            <Image
              src={avatarUrl || "/placeholder.svg"}
              alt={fullName}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Upload size={24} className="text-white" />
            </div>
          </>
        ) : (
          <div className="w-full h-full border-2 border-blue rounded-full flex items-center justify-center bg-gray-50">
            <Camera size={32} className="text-gray-400" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload avatar"
      />

      <div className="text-center">
        <div className="text-sm text-gray-500 mb-1">
          Don-Vip ID: {user.id}
          <button className="ml-1 text-gray-400">
            <Copy className="text-[#383838]" size={9} />
          </button>
        </div>
        <h1 className="text-xl font-medium">{fullName}</h1>
      </div>
    </div>
  );
}
