"use client";

import type React from "react";

import type { User } from "@/entities/user/model/types";
import { Button } from "@/shared/ui/button/button";
import { ChevronDown, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileEditFormProps {
  user: User;
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    birthDate: user.birthDate || "",
    phone: user.phone || "+7 903 000 00 00",
    email: user.email,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would call an API to update the user profile
    console.log("Updating profile with:", formData);
    alert("Профиль успешно обновлен");

    // Navigate back to profile page
    router.push("/profile");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Имя</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Фамилия</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Пол</label>
        <div className="relative">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 appearance-none"
          >
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
            <option value="other">Другой</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown size={18} className="text-gray-500" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Дата рождения</label>
        <input
          type="text"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          placeholder="ДД.ММ.ГГГГ"
          className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Телефон</label>
        <div className="flex items-center relative">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200"
          />
          <button
            type="button"
            className="ml-2 absolute right-4 text-blue font-medium"
          >
            Изменить
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Электронная почта
        </label>
        <div className="flex items-center relative">
          <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
            <Mail size={18} className="text-gray-400 mr-2" />
            <span>{user.email}</span>
          </div>
          <button
            type="button"
            className="ml-2 absolute right-4 text-blue font-medium"
          >
            Изменить
          </button>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-blue text-white rounded-full"
        >
          Сохранить изменения
        </Button>
      </div>
    </form>
  );
}
