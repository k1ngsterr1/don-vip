"use client";

import { useState, useEffect } from "react";
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
  mask?: "phone" | string;
}

export function FormInput({
  id,
  label,
  type,
  placeholder,
  defaultValue = "",
  Icon,
  required,
  translationNamespace,
  mask,
}: FormInputProps) {
  const t = useTranslations(`Payment.payment.form.${translationNamespace}`);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    if (mask === "phone") {
      let digits = input.replace(/\D/g, "");
      if (digits.startsWith("8")) digits = "7" + digits.slice(1); // авто-замена

      let formatted = "+";

      if (digits.startsWith("7")) {
        const rest = digits.slice(1);
        formatted = "+7";
        if (rest.length > 0) formatted += ` (${rest.slice(0, 3)}`;
        if (rest.length >= 3) formatted += `) ${rest.slice(3, 6)}`;
        if (rest.length >= 6) formatted += `-${rest.slice(6, 8)}`;
        if (rest.length >= 8) formatted += `-${rest.slice(8, 10)}`;
      } else {
        formatted += digits;
      }

      setValue(formatted);
    } else {
      setValue(input);
    }
  };

  return (
    <div className="space-y-2 w-full md:col-span-2">
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
        required={required}
        placeholder={t("placeholder") || placeholder}
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white transition-colors"
      />
    </div>
  );
}
