"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { apiClient } from "@/shared/config/apiClient";

export default function GoogleAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const { setTokens, setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function processAuth() {
      try {
        // Extract tokens from URL
        const accessToken = searchParams.get("access");
        const refreshToken = searchParams.get("refresh");

        if (!accessToken || !refreshToken) {
          setError("Missing authentication tokens");
          setIsLoading(false);
          return;
        }

        console.log("Tokens received:", {
          accessToken: accessToken.substring(0, 10) + "...",
          refreshToken: refreshToken.substring(0, 10) + "...",
        });

        // Store tokens in auth store
        setTokens(accessToken, refreshToken);
        console.log("Tokens stored in auth store");

        // Extract user ID from the response and redirect to profile page
        try {
          console.log("Fetching user profile...");
          const response = await apiClient.get("/user/me");
          console.log("User profile received:", response.data);

          // Extract the user ID from the response
          const userId = response.data.id;

          // Store the user data in the auth store
          setUser(response.data);

          // Add a small delay to ensure state is updated before navigation
          setTimeout(() => {
            if (userId) {
              // Include locale in the redirect if using i18n
              const profilePath = locale
                ? `/${locale}/profile/${userId}`
                : `/profile/${userId}`;
              console.log(`Redirecting to ${profilePath}...`);
              router.push(profilePath);
            } else {
              router.push("/");
            }
          }, 500);
        } catch (profileError) {
          console.error("Failed to fetch user profile:", profileError);
          // If we can't get the user profile, redirect to the general profile page
          setTimeout(() => {
            const fallbackPath = locale ? `/${locale}/profile` : "/profile";
            console.log("Redirecting to general profile page due to error...");
            router.push(fallbackPath);
          }, 500);
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setError("Failed to authenticate. Please try again.");
        setIsLoading(false);
      }
    }

    processAuth();
  }, [searchParams, setTokens, setUser, router, locale]);

  useEffect(() => {
    // Debug the auth state
    const authState = useAuthStore.getState();
    console.log("Current auth state:", {
      isAuthenticated: authState.isAuthenticated,
      hasAccessToken: !!authState.accessToken,
      hasRefreshToken: !!authState.refreshToken,
      hasUser: !!authState.user,
    });
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h1 className="text-xl font-semibold text-red-700 mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => {
              const loginPath = locale
                ? `/${locale}/auth/login`
                : "/auth/login";
              router.push(loginPath);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Completing Authentication
        </h1>
        <p className="text-gray-600">Please wait while we log you in...</p>
      </div>
    </div>
  );
}
