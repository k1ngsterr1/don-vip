"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface TestAccessContextType {
  isTestMode: boolean;
  hasAccess: boolean;
  grantAccess: () => void;
}

const TestAccessContext = createContext<TestAccessContextType | undefined>(
  undefined
);

export function useTestAccess() {
  const context = useContext(TestAccessContext);
  if (context === undefined) {
    throw new Error("useTestAccess must be used within a TestAccessProvider");
  }
  return context;
}

interface TestAccessProviderProps {
  children: ReactNode;
}

export function TestAccessProvider({ children }: TestAccessProviderProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if test mode is enabled
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

  useEffect(() => {
    if (!isTestMode) {
      setHasAccess(true);
      setIsLoading(false);
      return;
    }

    // Check if access was already granted in this session
    const accessGranted = sessionStorage.getItem("test_access_granted");
    if (accessGranted === "true") {
      setHasAccess(true);
    }
    setIsLoading(false);
  }, [isTestMode]);

  const grantAccess = () => {
    setHasAccess(true);
    sessionStorage.setItem("test_access_granted", "true");
  };

  const value = {
    isTestMode,
    hasAccess,
    grantAccess,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <TestAccessContext.Provider value={value}>
      {children}
    </TestAccessContext.Provider>
  );
}
