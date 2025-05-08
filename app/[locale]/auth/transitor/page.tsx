"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { Loader2 } from "lucide-react";

export default function AuthTransitorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const { setTokens } = useAuthStore();

  useEffect(() => {
    const processTokens = async () => {
      try {
        // Extract tokens from URL
        const accessToken = searchParams.get("access");
        const refreshToken = searchParams.get("refresh");

        if (!accessToken || !refreshToken) {
          throw new Error("Missing tokens in URL");
        }

        // Save tokens to auth store
        setTokens(accessToken, refreshToken);

        // Redirect to home page or dashboard
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } catch (err) {
        console.error("Error processing tokens:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to process authentication"
        );
      } finally {
        setIsProcessing(false);
      }
    };

    processTokens();
  }, [searchParams, setTokens, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Authentication</h1>
          {isProcessing ? (
            <div className="mt-6 flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-blue animate-spin" />
              <p className="mt-4 text-gray-600">Processing your login...</p>
            </div>
          ) : error ? (
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
            <div className="mt-6">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                Login successful! Redirecting...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
