"use client";

import type React from "react";
import { forwardRef } from "react";
import PhoneInputLib, { type Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { PhoneIcon } from "lucide-react"; // Import the Phone icon

// --- Self-Contained Utility & Components ---

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// --- PhoneInput Implementation ---

interface StyledUnderlyingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

// This component renders the actual <input> element with your desired base styles.
// It will be passed to PhoneInputLib via the `inputComponent` prop.
const StyledUnderlyingInput = forwardRef<
  HTMLInputElement,
  StyledUnderlyingInputProps
>(({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      maxLength={25} // Add this line
      className={cn(
        // Base styles from your AuthInput (excluding padding-right, which is handled by the style override)
        "w-full px-3 py-2.5 border rounded-[12px] bg-[#F3F4F7] text-sm focus:outline-none focus:ring-1",
        // Apply error styling conditionally
        error
          ? "border-[#ff272c] focus:ring-[#ff272c]"
          : "border-gray-300 focus:ring-blue",
        // This class is targeted by the <style> override for padding and border-radius
        "phone-input-base-override",
        className // This will include react-phone-number-input__input
      )}
      {...props}
    />
  );
});
StyledUnderlyingInput.displayName = "StyledUnderlyingInput";

type BasePhoneInputProps = Omit<
  React.ComponentProps<typeof PhoneInputLib>,
  | "value"
  | "onChange"
  | "inputComponent"
  | "countrySelectComponent"
  | "flagComponent"
  | "getInputRef"
>;

interface CustomPhoneInputProps extends BasePhoneInputProps {
  onChange: (value: string | undefined) => void;
  value?: string;
  placeholder?: string;
  defaultCountry?: Country;
  error?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, CustomPhoneInputProps>(
  (
    {
      className,
      onChange,
      value,
      placeholder,
      defaultCountry,
      error,
      ...restProps
    },
    ref
  ) => {
    // This component wrapper is needed to pass the `error` prop down to StyledUnderlyingInput
    const InputComponentWithError = forwardRef<
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement>
    >((props, inputRef) => (
      <StyledUnderlyingInput {...props} ref={inputRef} error={error} />
    ));
    InputComponentWithError.displayName = "InputComponentWithError";

    return (
      <>
        {/* Style override to ensure consistent border-radius and add padding for the icon */}
        <style>
          {`
            .phone-input-base-override.react-phone-number-input__input {
              border-radius: 12px !important;
              padding-right: 2.5rem !important; /* 40px, for pr-10 equivalent */
            }
          `}
        </style>
        <div className={cn("relative w-full", className)}>
          <PhoneInputLib
            getInputRef={ref}
            inputComponent={InputComponentWithError}
            countrySelectComponent={() => null}
            flagComponent={() => null}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            defaultCountry={defaultCountry}
            limitMaxLength // This prop is intended to help, but we're adding more robust checks
            {...restProps}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <PhoneIcon className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
