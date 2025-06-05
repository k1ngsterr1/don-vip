"use client";

import reactQueryClient from "@/shared/config/queryClient"; // Assuming this path is correct
import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  type Techwork,
  techworksApi,
} from "@/entities/techworks/api/techworks.api"; // Assuming this path and types are correct

interface ClientLayoutProps {
  children: ReactNode;
}

const getLocaleFromPathname = (pathname: string): string | null => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0 && parts[0].length === 2) {
    return parts[0];
  }
  return null;
};

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const [techworkData, setTechworkData] = useState<Techwork | null>(null);
  const techworkFetched = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (techworkFetched.current) return;

    const fetchTechwork = async () => {
      try {
        const data = await techworksApi.getTechwork();
        setTechworkData(data);
        console.log("[Techwork] Fetched data:", data);
      } catch (err) {
        console.error("[Techwork] Fetch error:", err);
      } finally {
        techworkFetched.current = true;
      }
    };

    fetchTechwork();
  }, []);

  useEffect(() => {
    if (!techworkFetched.current) {
      return;
    }

    const locale = getLocaleFromPathname(pathname);
    if (!locale) {
      console.warn(
        "[Techwork] Locale not determined for path:",
        pathname,
        ". No redirection applied for tech status."
      );
      return;
    }

    const dynamicTechWorksActivePagePath = `/${locale}/techworks`;
    const dynamicLocalizedRootPath = `/${locale}/`;

    const isTechWorksActive = techworkData ? techworkData.isTechWorks : false;

    if (isTechWorksActive) {
      if (pathname !== dynamicTechWorksActivePagePath) {
        console.log(
          `[Techwork] Active. Redirecting from ${pathname} to ${dynamicTechWorksActivePagePath}`
        );
        router.push(dynamicTechWorksActivePagePath);
      }
    } else {
      if (pathname === dynamicTechWorksActivePagePath) {
        console.log(
          `[Techwork] Not active. Redirecting from ${dynamicTechWorksActivePagePath} to ${dynamicLocalizedRootPath}`
        );
        router.push(dynamicLocalizedRootPath);
      }
    }
  }, [techworkData, pathname, router, techworkFetched]);

  if (!techworkFetched.current) {
    return null;
  }

  const locale = getLocaleFromPathname(pathname);
  const isCurrentlyTechWorksActive = techworkData
    ? techworkData.isTechWorks
    : false;

  if (locale) {
    const dynamicTechWorksActivePagePath = `/${locale}/techworks`;
    if (
      isCurrentlyTechWorksActive &&
      pathname !== dynamicTechWorksActivePagePath
    ) {
      return null;
    }
    if (
      !isCurrentlyTechWorksActive &&
      pathname === dynamicTechWorksActivePagePath
    ) {
      return null;
    }
  }

  return (
    <QueryClientProvider client={reactQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ClientLayout;
