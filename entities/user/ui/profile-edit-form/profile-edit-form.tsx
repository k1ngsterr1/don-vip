"use client";
import { useTranslations } from "next-intl";
import type React from "react";

import { Button } from "@/shared/ui/button/button";
import { FormField } from "@/shared/ui/form-field/form-field";
import {
  Calendar,
  ChevronDown,
  Mail,
  Phone,
  UserIcon,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { PhoneInputWithCountry } from "@/shared/ui/phone-input/phone-input";

interface User {
  id?: number;
  first_name?: string | null;
  last_name?: string | null;
  gender?: string;
  birth_date?: string | null;
  phone?: string | null;
  email?: string | null;
  identifier: string; // This is the primary login credential (phone or email)
  avatar?: string;
  role?: string;
}

interface ProfileEditFormProps {
  user: User;
  onSubmit?: (data: any) => Promise<any>;
  onCancel?: () => void;
  redirectAfterSubmit?: string;
}

export function ProfileEditForm({
  user,
  onSubmit,
  onCancel,
  redirectAfterSubmit = "/profile/1",
}: ProfileEditFormProps) {
  const i18n = useTranslations("ProfileEditForm");
  const router = useRouter();

  const isIdentifierEmail = user.identifier?.includes("@");

  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    gender: user.gender || "other",
    birth_date: user.birth_date || "",
    phone: isIdentifierEmail ? user.phone || "+" : user.identifier || "+",
    email: isIdentifierEmail ? user.identifier : user.email || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...(user.id && { id: user.id }),
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        gender: formData.gender,
        birth_date: formData.birth_date || null,
        phone: formData.phone && formData.phone !== "+" ? formData.phone : null, // Send null if phone is just "+"
        email: formData.email || null,
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        alert(i18n("successMessage"));
      }

      if (redirectAfterSubmit) {
        router.push(redirectAfterSubmit as any);
      }
    } catch (error) {
      alert(i18n("errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  // Mobile version
  const mobileForm = (
    <form onSubmit={handleSubmit} className="space-y-5 md:hidden">
      <FormField
        label={i18n("fields.firstName")}
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        type="text"
        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
      />
      <FormField
        label={i18n("fields.lastName")}
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        type="text"
        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
      />
      <div>
        <label className="block text-sm font-medium mb-1">
          {i18n("fields.gender")}
        </label>
        <div className="relative">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 appearance-none"
          >
            <option value="male">{i18n("genderOptions.male")}</option>
            <option value="female">{i18n("genderOptions.female")}</option>
            <option value="other">{i18n("genderOptions.other")}</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown size={18} className="text-gray-500" />
          </div>
        </div>
      </div>

      <FormField
        label={i18n("fields.birthDate")}
        name="birth_date"
        value={formData.birth_date}
        onChange={handleChange}
        type="text"
        placeholder={i18n("fields.birthDatePlaceholder")}
        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
        mask="date"
      />

      <div>
        <label className="block text-sm font-medium mb-1">
          {i18n("fields.phone")}
        </label>
        <div className="flex items-center relative">
          <PhoneInputWithCountry
            value={formData.phone}
            onChange={handleChange as any}
            className=" !bg-gray-50 !rounded-lg"
            placeholder="(___) ___-__-__"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          {i18n("fields.email")}
        </label>
        <div className="flex items-center relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200"
            placeholder="example@email.com"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-blue text-white rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? i18n("buttons.saving") : i18n("buttons.saveChanges")}
        </Button>
      </div>
    </form>
  );

  // Desktop version
  const desktopForm = (
    <form onSubmit={handleSubmit} className="hidden md:block">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <FormField
            label={i18n("fields.firstName")}
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            type="text"
            icon={<UserIcon size={18} />}
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
          />

          <FormField
            label={i18n("fields.lastName")}
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            type="text"
            icon={<UserRound size={18} />}
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
          />
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {i18n("fields.gender")}
            </label>
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 pl-10 bg-gray-50 rounded-lg border border-gray-200 appearance-none focus:border-blue focus:ring-1 focus:ring-blue focus:outline-none transition-colors"
              >
                <option value="male">{i18n("genderOptions.male")}</option>
                <option value="female">{i18n("genderOptions.female")}</option>
                <option value="other">{i18n("genderOptions.other")}</option>
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 22V12"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown size={18} className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <FormField
            label={i18n("fields.birthDate")}
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            type="text"
            placeholder={i18n("fields.birthDatePlaceholder")}
            icon={<Calendar size={18} />}
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
            mask="date"
          />
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {i18n("fields.phone")}
            </label>
            <PhoneInputWithCountry
              value={formData.phone}
              onChange={handleChange as any}
              className=" !bg-gray-50 !rounded-lg"
              placeholder="(___) ___-__-__"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {i18n("fields.email")}
            </label>
            <FormField
              label=""
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              icon={<Mail size={18} />}
              className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
              placeholder="example@email.com"
            />
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {i18n("buttons.cancel")}
        </button>
        <Button
          type="submit"
          className="px-8 py-3 bg-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow"
          disabled={isSubmitting}
        >
          {isSubmitting ? i18n("buttons.saving") : i18n("buttons.saveChanges")}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      {mobileForm}
      {desktopForm}
    </>
  );
}
