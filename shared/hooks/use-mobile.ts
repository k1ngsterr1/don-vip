"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the current device is a mobile device based on screen width
 * @param breakpoint The maximum width in pixels to consider as a mobile device (default: 768)
 * @returns A boolean indicating if the current device is a mobile device
 */
export function useMobile(breakpoint = 768): boolean {
  // Initialize with null to handle SSR
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (browser environment)
    if (typeof window === "undefined") return;

    // Function to update the state based on window width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
}

// For backwards compatibility
export default useMobile;
