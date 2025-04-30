"use client";

import { ChevronDown } from "lucide-react";
import type React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: SelectOption[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
}

export function SelectField({
  label,
  name,
  value,
  options,
  onChange,
  icon,
  error,
  className = "",
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-1 md:mb-2 md:text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`${className} ${
            icon ? "pl-10" : ""
          } w-full p-3 bg-gray-50 rounded-lg border border-gray-200 appearance-none ${
            error ? "border-red-500" : ""
          } md:focus:border-blue md:focus:ring-1 md:focus:ring-blue md:focus:outline-none md:transition-colors`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown size={18} className="text-gray-500" />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
