"use client";

import type React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  icon?: React.ReactNode;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export function FormField({
  label,
  name,
  error,
  icon,
  actionButton,
  className,
  ...props
}: FormFieldProps) {
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
        <input
          id={name}
          name={name}
          className={`${className} ${icon ? "pl-10" : ""} ${
            actionButton ? "pr-20" : ""
          } ${
            error ? "border-red-500" : ""
          } md:focus:border-blue md:focus:ring-1 md:focus:ring-blue md:focus:outline-none md:transition-colors`}
          {...props}
        />
        {actionButton && (
          <button
            type="button"
            onClick={actionButton.onClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue font-medium md:hover:text-blue-700 md:transition-colors"
          >
            {actionButton.text}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
