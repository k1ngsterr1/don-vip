"use client";

import type { User } from "@/entities/user/model/types";
import { ProfileEditForm } from "@/entities/user/ui/profile-edit-form/profile-edit-form";
import { ProfileHeaderEditable } from "@/entities/user/ui/profile-header-editable/profile-header-editable";

// Mock user data
const mockUser = {
  id: "6758797",
  firstName: "Винсент",
  lastName: "Вега",
  gender: "male" as const,
  birthDate: "02.11.1992",
  phone: "+7 903 000 00 00",
  email: "mail@gmail.com",
};

export default function ProfileEditPage() {
  // Example of custom submit handler
  const handleProfileUpdate = async (userData: Partial<User>) => {
    // In a real app, this would be an API call
    console.log("Updating profile with:", userData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message
    alert("Профиль успешно обновлен");
  };

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
            <ProfileHeaderEditable user={mockUser} />
          </div>

          {/* Right column with form on desktop */}
          <div className="md:w-2/3 md:pl-8">
            <h2 className="hidden md:block text-2xl font-unbounded font-medium mb-6 text-gray-800">
              Редактирование профиля
            </h2>
            <ProfileEditForm
              user={mockUser}
              onSubmit={handleProfileUpdate}
              redirectAfterSubmit="/profile/1"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
