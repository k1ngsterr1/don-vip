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

  // Show loading state while checking techworks status
  if (isLoading && !isOnTechworksPage) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-center text-gray-600">
            Checking system status...
          </p>
        </div>
      </div>
    );
  }

  // If techworks is active and we're not on the techworks page, the hook will handle the redirect
  // If techworks is not active and we're on the techworks page, we should redirect away
  // but we handle this in the hook as well

  return <>{children}</>;
};
