"use client";

import reactQueryClient from "@/shared/config/queryClient"; // Assuming this path is correct
import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { TechworksChecker } from "@/entities/techworks/ui/TechworksChecker";

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <TechworksChecker>{children}</TechworksChecker>
    </QueryClientProvider>
  );
};

export default ClientLayout;
