"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/entities/auth/store/auth.store";

export default function ExternalCallbackBlock() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { setTokens } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const accessToken = searchParams.get("access");
        const refreshToken = searchParams.get("refresh");

        if (!accessToken || !refreshToken) {
          throw new Error("Missing tokens in URL");
        }

        setTokens(accessToken, refreshToken);

        router.push("/ru");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    };

    handleCallback();
  }, [searchParams, setTokens, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Authentication</h1>
          {error ? (
            <div className="mt-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
              <button
                onClick={() => router.push("/auth/login")}
                className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-blue animate-spin" />
              <p className="mt-4 text-gray-600">Processing your login...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
