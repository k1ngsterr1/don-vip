"use client";

import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  defaultValue?: string;
  Icon: LucideIcon;
  required?: boolean;
  translationNamespace: string;
}

export function FormInput({
  id,
  label,
  type,
  placeholder,
  defaultValue,
  Icon,
  translationNamespace,
}: FormInputProps) {
  const t = useTranslations(`Payment.payment.form.${translationNamespace}`);

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium flex items-center gap-2 text-gray-700"
      >
        <Icon className="h-4 w-4 text-[#6798de]" />
        {t("label")}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={t("placeholder")}
        defaultValue={defaultValue}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white transition-colors"
      />
    </div>
  );
}
