"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/shared/utils/cn";
import { userApi } from "@/entities/user/auth/user-api";
import { VerificationPopup } from "@/entities/auth/ui/verification-popup/verification-popup";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Maximum width for the content on desktop screens
   * @default "1280px"
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | string;
  /**
   * Whether to add padding to the content
   * @default true
   */
  withPadding?: boolean;
  /**
   * Whether to center the content
   * @default true
   */
  centered?: boolean;
  /**
   * HTML tag to use for the wrapper
   * @default "div"
   */
  as?: React.ElementType;
  /**
   * Whether to check user verification
   * @default true
   */
  checkVerification?: boolean;
}

export const ContentWrapper: React.FC<ContentWrapperProps> = ({
  children,
  className,
  maxWidth = "xl",
  withPadding = true,
  centered = true,
  as: Component = "div",
  checkVerification = true,
}) => {
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (checkVerification) {
      const checkUserVerification = async () => {
        try {
          setIsLoading(true);
          const user = await userApi.getCurrentUser();
          if (user && user.is_verified === false) {
            setShowVerificationPopup(true);
          }
        } catch (error) {
          console.error("Error checking user verification:", error);
        } finally {
          setIsLoading(false);
        }
      };

      checkUserVerification();
    }
  }, [checkVerification]);

  // Map maxWidth prop to Tailwind classes
  const maxWidthClass =
    {
      sm: "max-w-screen-sm", // 640px
      md: "max-w-screen-md", // 768px
      lg: "max-w-screen-lg", // 1024px
      xl: "max-w-screen-xl", // 1280px
      "2xl": "max-w-screen-2xl", // 1536px
      full: "max-w-full",
    }[maxWidth] ||
    (maxWidth.includes("px") ||
    maxWidth.includes("%") ||
    maxWidth.includes("rem")
      ? ""
      : "max-w-screen-xl");

  return (
    <>
      <Component
        className={cn(
          "w-full",
          maxWidthClass || `max-w-[${maxWidth}]`,
          withPadding && "px-4 sm:px-6 md:px-8",
          centered && "mx-auto",
          className
        )}
      >
        {children}
      </Component>

      <VerificationPopup
        isOpen={showVerificationPopup}
        onClose={() => setShowVerificationPopup(false)}
      />
    </>
  );
};
