"use client";

import reactQueryClient from "@/shared/config/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Techwork, techworksApi } from "@/entities/techworks/api/techworks.api";

interface ClientLayoutProps {
  children: ReactNode;
}

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
        techworkFetched.current = true;
        console.log("[Techwork] Fetched:", data);
      } catch (err) {
        console.error("[Techwork] Fetch error:", err);
      }
    };

    fetchTechwork();
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/techworks")) {
      router.push("/techworks");
    }
  }, [pathname, router]);

  return (
    <QueryClientProvider client={reactQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ClientLayout;
