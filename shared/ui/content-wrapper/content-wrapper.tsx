"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Added
import { cn } from "@/shared/utils/cn";
import { userApi } from "@/entities/user/auth/user-api";
import { VerificationPopup } from "@/entities/auth/ui/verification-popup/verification-popup";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Maximum width for the content on desktop screens
   * @default "xl" which maps to "max-w-[1680px]"
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
  const pathname = usePathname();

  useEffect(() => {
    const localeRegex = /^\/(ru|en)(\/|$)/;
    const normalizedPathname = pathname.replace(localeRegex, "/");

    const verificationPaths = ["/reviews", "/coupons"];
    // Regex to match /profile/[any-id]/purchases
    const profilePurchasesRegex = /^\/profile\/[^/]+\/purchases$/;

    const isOnVerificationPage =
      verificationPaths.includes(normalizedPathname) ||
      profilePurchasesRegex.test(normalizedPathname);

    if (checkVerification && isOnVerificationPage) {
      setIsLoading(true); // Set loading true when starting verification check
      const checkUserVerification = async () => {
        try {
          const user = await userApi.getCurrentUser();
          if (user && user.is_verified === false) {
            setShowVerificationPopup(true);
          } else {
            setShowVerificationPopup(false); // Hide if user is verified or not found
          }
        } catch (error) {
          console.error("Error checking user verification:", error);
          setShowVerificationPopup(false); // Hide popup on error
        } finally {
          setIsLoading(false);
        }
      };

      checkUserVerification();
    } else {
      // If not checking verification or not on a specified page,
      // ensure popup is hidden and loading is false.
      setShowVerificationPopup(false);
      setIsLoading(false);
    }
  }, [checkVerification, pathname]); // Rerun effect if checkVerification or pathname changes

  const handleCloseVerificationPopup = () => {
    setShowVerificationPopup(false);
  };

  // Map maxWidth prop to Tailwind classes
  const maxWidthClass =
    {
      sm: "max-w-screen-sm", // 640px
      md: "max-w-screen-md", // 768px
      lg: "max-w-screen-lg", // 1024px
      xl: "max-w-[1680px]", // Custom definition for xl
      "2xl": "max-w-screen-2xl", // 1536px
      full: "max-w-full",
    }[maxWidth] ||
    (typeof maxWidth === "string" &&
    (maxWidth.includes("px") ||
      maxWidth.includes("%") ||
      maxWidth.includes("rem"))
      ? "" // Custom value provided, will be handled by template literal
      : "max-w-[1680px]"); // Default fallback, matching 'xl'

  return (
    <>
      <Component
        className={cn(
          "w-full",
          maxWidthClass || `max-w-[${maxWidth}]`, // Apply maxWidth if it's a custom string value
          withPadding && "px-4 sm:px-6 md:px-8",
          centered && "mx-auto",
          className
        )}
      >
        {children}
      </Component>
      <VerificationPopup
        isOpen={showVerificationPopup}
        onClose={handleCloseVerificationPopup}
      />
    </>
  );
};
