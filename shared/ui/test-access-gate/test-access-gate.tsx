"use client";

import { ReactNode } from "react";
import { useTestAccess } from "@/shared/providers/test-access-provider";
import { TestAccessForm } from "@/shared/ui/test-access-form/test-access-form";

interface TestAccessGateProps {
  children: ReactNode;
}

export function TestAccessGate({ children }: TestAccessGateProps) {
  const { isTestMode, hasAccess, grantAccess } = useTestAccess();

  // If not in test mode, show content normally
  if (!isTestMode) {
    return <>{children}</>;
  }

  // If in test mode but no access, show login form
  if (!hasAccess) {
    return <TestAccessForm onAccessGranted={grantAccess} />;
  }

  // If access granted, show content
  return <>{children}</>;
}
