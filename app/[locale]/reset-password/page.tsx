"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { Eye, EyeOff, Lock, CheckCircle, AlertTriangle } from "lucide-react";
import { useResetPasswordWithToken } from "@/entities/user/hooks/mutations 01-53-42-528/use-reset-password";

export default function ResetPasswordPage() {
  const t = useTranslations("resetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  // Reset password mutation
  const resetPasswordMutation = useResetPasswordWithToken();

  useEffect(() => {
    // Check if token exists in URL
    if (!token) {
      setTokenValid(false);
      setError(t("errors.missingToken"));
    }
  }, [token, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.new_password) {
      setError(t("errors.passwordRequired"));
      return false;
    }

    if (formData.new_password.length < 8) {
      setError(t("errors.passwordTooShort"));
      return false;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError(t("errors.passwordMismatch"));
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !token) return;

    // Clear any previous errors
    setError("");

    // Execute the mutation
    resetPasswordMutation.mutate(
      {
        new_password: formData.new_password,
        token: token,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          // Redirect to login page after 2 seconds
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        },
        onError: (error: Error) => {
          setError(error.message || t("errors.generic"));
        },
      }
    );
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ContentWrapper>
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg border border-green-200 p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-green-800">
                  {t("success.title")}
                </h2>
                <p className="text-green-700">{t("success.description")}</p>
                <p className="text-sm text-green-600">
                  {t("success.redirecting")}
                </p>
              </div>
            </div>
          </div>
        </ContentWrapper>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ContentWrapper>
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg border border-yellow-200 p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-xl font-semibold text-yellow-800">
                  {t("invalidToken.title")}
                </h2>
                <p className="text-yellow-700">
                  {t("invalidToken.description")}
                </p>
                <button
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => router.push("/forgot-password")}
                >
                  {t("invalidToken.requestNew")}
                </button>
              </div>
            </div>
          </div>
        </ContentWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 xxs:px-1">
      <ContentWrapper>
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            {/* Header */}
            <div className="text-center p-6 pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 xxs:text-xl">
                {t("title")}
              </h1>
              <p className="text-gray-600 mt-2 xxs:text-xs">
                {t("description")}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                {(error || resetPasswordMutation.error) && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-800 text-sm">
                      {error ||
                        (resetPasswordMutation.error instanceof Error
                          ? resetPasswordMutation.error.message
                          : t("errors.generic"))}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="new_password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("fields.newPassword")}
                  </label>
                  <div className="relative">
                    <input
                      id="new_password"
                      name="new_password"
                      type={showPassword ? "text" : "password"}
                      value={formData.new_password}
                      onChange={handleInputChange}
                      placeholder={t("placeholders.newPassword")}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirm_password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("fields.confirmPassword")}
                  </label>
                  <div className="relative">
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      placeholder={t("placeholders.confirmPassword")}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p className="font-medium">{t("requirements.title")}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t("requirements.minLength")}</li>
                    <li>{t("requirements.different")}</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 xxs:text-sm"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending
                    ? t("buttons.updating")
                    : t("buttons.update")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
