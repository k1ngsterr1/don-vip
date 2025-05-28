"use client";

import type React from "react";
import { useState, useEffect } from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  icon?: React.ReactNode;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
  mask?: "date" | "phone" | "currency" | string;
}

export function FormField({
  label,
  name,
  error,
  icon,
  actionButton,
  className,
  mask,
  value,
  onChange,
  ...props
}: FormFieldProps) {
  const [inputValue, setInputValue] = useState(value || "");

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Handle input change with masking
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (mask === "date") {
      // Apply date mask (DD.MM.YYYY)
      const digits = newValue.replace(/\D/g, "");
      let maskedValue = "";

      if (digits.length > 0) {
        // Add first digit of day
        maskedValue = digits.substring(0, 1);

        if (digits.length > 1) {
          // Add second digit of day
          maskedValue = digits.substring(0, 2);

          if (digits.length > 2) {
            // Add dot and first digit of month
            maskedValue = `${digits.substring(0, 2)}.${digits.substring(2, 3)}`;

            if (digits.length > 3) {
              // Add second digit of month
              maskedValue = `${digits.substring(0, 2)}.${digits.substring(
                2,
                4
              )}`;

              if (digits.length > 4) {
                // Add dot and first digit of year
                maskedValue = `${digits.substring(0, 2)}.${digits.substring(
                  2,
                  4
                )}.${digits.substring(4, 5)}`;

                if (digits.length > 5) {
                  // Add remaining digits of year (up to 4 digits)
                  maskedValue = `${digits.substring(0, 2)}.${digits.substring(
                    2,
                    4
                  )}.${digits.substring(4, 8)}`;
                }
              }
            }
          }
        }
      }

      // Validate day (01-31)
      if (maskedValue.length >= 2) {
        const day = Number.parseInt(maskedValue.substring(0, 2));
        if (day > 31) {
          maskedValue = `31${maskedValue.substring(2)}`;
        } else if (day === 0) {
          maskedValue = `01${maskedValue.substring(2)}`;
        }
      }

      // Validate month (01-12)
      if (maskedValue.length >= 5) {
        const month = Number.parseInt(maskedValue.substring(3, 5));
        if (month > 12) {
          maskedValue = `${maskedValue.substring(
            0,
            3
          )}12${maskedValue.substring(5)}`;
        } else if (month === 0) {
          maskedValue = `${maskedValue.substring(
            0,
            3
          )}01${maskedValue.substring(5)}`;
        }
      }

      setInputValue(maskedValue);

      // Create a synthetic event to pass to the original onChange handler
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            name: name,
            value: maskedValue,
          },
        };
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
    } else if (mask === "phone") {
      // Apply phone mask (+X XXX XXX-XX-XX)
      const digits = newValue.replace(/\D/g, "");
      let maskedValue = "";

      if (digits.length > 0) {
        maskedValue = `+${digits.substring(0, 1)}`;

        if (digits.length > 1) {
          maskedValue = `+${digits.substring(0, 1)} ${digits.substring(1, 4)}`;

          if (digits.length > 4) {
            maskedValue = `+${digits.substring(0, 1)} ${digits.substring(
              1,
              4
            )} ${digits.substring(4, 7)}`;

            if (digits.length > 7) {
              maskedValue = `+${digits.substring(0, 1)} ${digits.substring(
                1,
                4
              )} ${digits.substring(4, 7)}-${digits.substring(7, 9)}`;

              if (digits.length > 9) {
                maskedValue = `+${digits.substring(0, 1)} ${digits.substring(
                  1,
                  4
                )} ${digits.substring(4, 7)}-${digits.substring(
                  7,
                  9
                )}-${digits.substring(9, 11)}`;
              }
            }
          }
        }
      }

      setInputValue(maskedValue);

      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            name: name,
            value: maskedValue,
          },
        };
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
    } else {
      // No mask or custom mask handling
      setInputValue(newValue);

      if (onChange) {
        onChange(e);
      }
    }
  };

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
          value={inputValue}
          onChange={handleInputChange}
          className={`${className} ${icon ? "pl-10" : ""} ${
            actionButton ? "pr-20" : ""
          } ${
            error ? "border-red-500" : ""
          } md:focus:border-blue md:focus:ring-1  !text-dark md:focus:ring-blue md:focus:outline-none md:transition-colors`}
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
