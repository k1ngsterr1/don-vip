// shared/ui/content-wrapper/content-wrapper.tsx
import React from "react";
import { cn } from "@/shared/utils/cn";

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
}

/**
 * ContentWrapper component for constraining content width across different devices
 *
 * @example
 * // Basic usage
 * <ContentWrapper>
 *   <YourContent />
 * </ContentWrapper>
 *
 * @example
 * // Custom max width
 * <ContentWrapper maxWidth="md">
 *   <YourContent />
 * </ContentWrapper>
 *
 * @example
 * // Without padding
 * <ContentWrapper withPadding={false}>
 *   <YourContent />
 * </ContentWrapper>
 */
export const ContentWrapper: React.FC<ContentWrapperProps> = ({
  children,
  className,
  maxWidth = "xl",
  withPadding = true,
  centered = true,
  as: Component = "div",
}) => {
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
  );
};
