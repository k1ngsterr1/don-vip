"use client";

import type { User } from "@/entities/user/model/types";
import { ProfileEditForm } from "@/entities/user/ui/profile-edit-form/profile-edit-form";
import { Button } from "@/shared/ui/button/button";
import { useState } from "react";

interface ProfileEditWidgetProps {
  user: User;
  onSave?: (updatedUser: Partial<User>) => void;
}

export function ProfileEditWidget({ user, onSave }: ProfileEditWidgetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<Partial<User>>({});

  const handleUpdate = (data: Partial<User>) => {
    setUpdatedUser({ ...updatedUser, ...data });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(updatedUser);
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Личная информация</h2>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="text-blue bg-transparent hover:bg-blue/10"
            type="button"
          >
            Редактировать
          </Button>
        )}
      </div>
      {/* fix */}
      <ProfileEditForm user={user} />
      {isEditing && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => setIsEditing(false)}
            className="mr-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
            type="button"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue text-white"
            type="button"
          >
            Сохранить
          </Button>
        </div>
      )}
    </div>
  );
}
