"use client";

import { useTechworksRedirect } from "../hooks/useTechworksRedirect";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Helper function to extract locale from pathname
 */
const getLocaleFromPathname = (pathname: string): string | null => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0 && parts[0].length === 2) {
    return parts[0];
  }
  return null;
};

/**
 * Component that checks techworks status and redirects if needed.
 * Should be placed in the root layout or main components.
 */
export const TechworksChecker = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isTechworksActive, isLoading, error } = useTechworksRedirect();
  const pathname = usePathname();

  // Extract locale from pathname
  const locale = getLocaleFromPathname(pathname);
  const isOnTechworksPage = pathname.includes("/techworks");

  useEffect(() => {
    if (error) {
      console.error("Techworks checker error:", error);
    }
  }, [error]);

  // If techworks is active and we're not on the techworks page, the hook will handle the redirect
  // If techworks is not active and we're on the techworks page, we should redirect away
  // but we handle this in the hook as well

  return <>{children}</>;
};
