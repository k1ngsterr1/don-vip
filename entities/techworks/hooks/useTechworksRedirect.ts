import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { techworksApi } from "../api/techworks.api";

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
 * Custom hook to check techworks status and redirect to techworks page if active.
 * This hook should be used in components that need to check for techworks status.
 */
export const useTechworksRedirect = () => {
  const [isTechworksActive, setIsTechworksActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkTechworksStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const isActive = await techworksApi.checkTechworksStatus();
        setIsTechworksActive(isActive);

        // Extract locale from current pathname
        const locale = getLocaleFromPathname(pathname);
        if (!locale) {
          console.warn(
            "[Techworks] Locale not determined for path:",
            pathname,
            ". No redirection applied for tech status."
          );
          return;
        }

        const techworksPath = `/${locale}/techworks`;
        const homePath = `/${locale}`;
        const isOnTechworksPage = pathname === techworksPath;

        // If techworks is active (ID is 1 and isTechWorks is true), redirect to techworks page
        if (isActive && !isOnTechworksPage) {
          console.log(
            `[Techworks] Active. Redirecting from ${pathname} to ${techworksPath}`
          );
          router.push(techworksPath);
        }
        // If techworks is not active and we're on the techworks page, redirect to home
        else if (!isActive && isOnTechworksPage) {
          console.log(
            `[Techworks] Not active. Redirecting from ${techworksPath} to ${homePath}`
          );
          router.push(homePath);
        }
      } catch (err) {
        console.error("Error checking techworks status:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Don't redirect on error, allow normal site usage
        setIsTechworksActive(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTechworksStatus();
  }, [router, pathname]);

  return {
    isTechworksActive,
    isLoading,
    error,
    checkTechworksStatus: async () => {
      try {
        const isActive = await techworksApi.checkTechworksStatus();
        setIsTechworksActive(isActive);
        return isActive;
      } catch (err) {
        console.error("Error checking techworks status:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      }
    },
  };
};
