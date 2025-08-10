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
    const accessData = sessionStorage.getItem("test_access_granted");
    if (accessData) {
      try {
        const parsed = JSON.parse(accessData);
        const currentTime = Date.now();
        const sessionAge = currentTime - (parsed.timestamp || 0);

        // Расширенная валидация сессии (8 часов вместо 24)
        const isValidSession =
          parsed.granted &&
          sessionAge < 8 * 60 * 60 * 1000 &&
          parsed.session &&
          parsed.loginHash &&
          parsed.userAgent;

        if (isValidSession) {
          setHasAccess(true);
        } else {
          // Clear expired or invalid session
          sessionStorage.removeItem("test_access_granted");
        }
      } catch {
        // Invalid data, clear it
        sessionStorage.removeItem("test_access_granted");
      }
    }
    setIsLoading(false);
  }, [isTestMode]);

  const grantAccess = () => {
    setHasAccess(true);
    const accessData = {
      granted: true,
      timestamp: Date.now(),
      session: Math.random().toString(36).substring(2, 15),
      userAgent:
        typeof navigator !== "undefined"
          ? navigator.userAgent.substring(0, 50)
          : "",
      loginHash: btoa("admin_session").substring(0, 10),
    };
    sessionStorage.setItem("test_access_granted", JSON.stringify(accessData));
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
