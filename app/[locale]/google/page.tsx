"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { apiClient } from "@/shared/config/apiClient";
import { useTranslations } from "next-intl";
import { authApi } from "@/entities/auth/api/auth.api";

export default function GoogleAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const { setTokens, setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const t = useTranslations("google-auth");

  useEffect(() => {
    async function processAuth() {
      try {
        // Extract tokens from URL
        const accessToken = searchParams.get("access");
        const refreshToken = searchParams.get("refresh");

        if (!accessToken || !refreshToken) {
          setError(t("errors.missingTokens"));
          setIsLoading(false);
          return;
        }

        // Store tokens in auth store
        setTokens(accessToken, refreshToken);

        try {
          const response = await authApi.getCurrentUser();

          const userId = response.data.id;

          setUser(response.data);

          setTimeout(() => {
            if (userId) {
              const profilePath = locale ? `/${locale}` : `/`;
              router.push(profilePath);
            } else {
              router.push("/");
            }
          }, 500);
        } catch (profileError) {
          setTimeout(() => {
            const fallbackPath = locale ? `/${locale}` : "/";
            router.push(fallbackPath);
          }, 500);
        }
      } catch (err) {
        setError(t("errors.authFailed"));
        setIsLoading(false);
      }
    }

    processAuth();
  }, [searchParams, setTokens, setUser, router, locale, t]);

  if (!isLoading) {
    router.push("/");
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full shadow-sm animate-fadeIn">
          <h1 className="text-xl font-semibold text-red-700 mb-2">
            {t("errors.errorTitle")}
          </h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => {
              const loginPath = locale
                ? `/${locale}/auth/login`
                : "/auth/login";
              router.push(loginPath);
            }}
            className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue/90 transition-colors"
          >
            {t("actions.returnToLogin")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full text-center shadow-sm animate-fadeIn">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 border-t-4 border-blue border-solid rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-semibold text-dark mb-3">
          {t("loading.title")}
        </h1>
        <p className="text-gray-600">{t("loading.message")}</p>
      </div>
    </div>
  );
}
