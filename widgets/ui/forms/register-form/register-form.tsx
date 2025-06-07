"use client";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import type React from "react";
import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";
import { useState, useEffect } from "react";
import { Loader2, Info, Mail } from "lucide-react";
import { AuthLoadingOverlay } from "@/shared/ui/auth-loading/auth-loading";
import { useRegister } from "@/entities/auth/hooks/use-auth";
import { Link } from "@/i18n/navigation";
import { PasswordStrength } from "@/shared/ui/password-strength/password-strength";
import { PhoneInput } from "@/shared/ui/phone-input/phone-input";
import { useRouter } from "@/i18n/routing";
import { isValidPhoneNumber } from "react-phone-number-input";

const errorTranslations: Record<string, Record<string, string>> = {
  en: {
    // Form validation errors
    "Email or phone is required": "Email or phone is required",
    "Invalid email format": "Please enter a valid email",
    "Invalid phone number":
      "Please enter a valid phone number (e.g. +1234567890)",
    "Password is required": "Password is required",
    "Password is too weak": "Password is too weak. Please make it stronger.",

    // API errors
    "Email already in use": "Email already in use",
    "Phone number already in use": "Phone number already in use",
    "Invalid information provided": "Invalid information provided",
    "Registration is temporarily disabled":
      "Registration is temporarily disabled",
    "Too many registration attempts":
      "Too many registration attempts, please try again later",
    "Registration failed":
      "Registration failed. Please check your information.",

    "status code 400": "Invalid information provided",
    "status code 409": "This email or phone is already registered",
    "status code 422": "Please check your information",
    "status code 429": "Too many registration attempts, please try again later",
    "status code 500": "Registration failed. Please try again later",
  },
  ru: {
    "Email or phone is required": "Email или телефон обязательны",
    "Invalid email format": "Пожалуйста, введите корректный email",
    "Invalid phone number":
      "Пожалуйста, введите корректный номер телефона (например +71234567890)",
    "Password is required": "Требуется пароль",
    "Password is too weak":
      "Пароль слишком слабый. Пожалуйста, сделайте его сильнее.",

    "Email already in use": "Email уже используется",
    "Phone number already in use": "Номер телефона уже используется",
    "Invalid information provided": "Предоставлена неверная информация",
    "Registration is temporarily disabled": "Регистрация временно отключена",
    "Too many registration attempts": "Слишком много попыток регистрации",
    "Registration failed":
      "Ошибка регистрации. Пожалуйста, проверьте вашу информацию.",

    "status code 400": "Предоставлена неверная информация",
    "status code 409": "Этот email или телефон уже зарегистрирован",
    "status code 422": "Пожалуйста, проверьте вашу информацию",
    "status code 429":
      "Слишком много попыток регистрации, пожалуйста, попробуйте позже",
    "status code 500": "Ошибка регистрации. Пожалуйста, попробуйте снова позже",
  },
};

function translateError(message: string, locale: string): string {
  const translations = errorTranslations[locale === "ru" ? "ru" : "en"];
  if (translations[message]) return translations[message];
  for (const key of Object.keys(translations)) {
    if (message.includes(key)) return translations[key];
  }
  return message;
}

function getHumanReadableError(error: string, locale = "en"): string {
  if (error.includes("status code 400"))
    return translateError("status code 400", locale);
  if (error.includes("status code 409"))
    return translateError("status code 409", locale);
  if (error.includes("status code 422"))
    return translateError("status code 422", locale);
  if (error.includes("status code 429"))
    return translateError("status code 429", locale);
  if (error.includes("status code"))
    return translateError("status code 500", locale);
  return translateError(error, locale);
}

export function RegisterForm() {
  const i18n = useTranslations("register-form_auth.registerForm");
  const locale = useLocale();
  const [identifier, setIdentifier] = useState<string>("");
  const [identifierType, setIdentifierType] = useState<"email" | "phone">(
    "email"
  );
  const [password, setPassword] = useState("");
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const {
    mutate: register,
    isPending: isLoading,
    error: registerError,
  } = useRegister();

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const criteriaMet = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  ].filter(Boolean).length;

  useEffect(() => {
    const input = identifier.trim();
    if (input) {
      if (input.includes("@")) {
        setIdentifierType("email");
      } else if (
        input.startsWith("+") ||
        input.replace(/[^0-9]/g, "").length > input.length / 2
      ) {
        setIdentifierType("phone");
      }
    }
  }, [identifier]);

  const validateLocalIdentifier = (value: string, type: "email" | "phone") => {
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    } else {
      return isValidPhoneNumber(value);
    }
  };

  const validatePassword = () => hasMinLength && criteriaMet >= 2;
  const isFormFilled =
    identifier.trim() !== "" && password.trim() !== "" && validatePassword();

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(value);
    if (errors.identifier) {
      setErrors((prev) => ({ ...prev, identifier: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {
      identifier: !identifier.trim()
        ? translateError("Email or phone is required", locale)
        : !validateLocalIdentifier(identifier, identifierType)
        ? translateError(
            identifierType === "email"
              ? "Invalid email format"
              : "Invalid phone number",
            locale
          )
        : undefined,
      password: !password.trim()
        ? translateError("Password is required", locale)
        : !validatePassword()
        ? translateError("Password is too weak", locale)
        : undefined,
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    register(
      { identifier: identifier.trim(), password, lang: locale },
      {
        onSuccess: () => {
          setIsRedirecting(true);
          setTimeout(() => {
            router.push(
              `/auth/verify?identifier=${encodeURIComponent(identifier)}` as any
            );
          }, 800);
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            (error.message
              ? getHumanReadableError(error.message, locale)
              : translateError("Registration failed", locale));
          setErrors({ identifier: errorMessage });
          setDebugInfo(
            (prev) =>
              `${prev || ""}\n\nError: ${JSON.stringify(
                error.response?.data || error.message
              )}`
          );
        },
      }
    );
  };

  const showLoadingOverlay = isLoading || isRedirecting;
  const loadingState = isRedirecting ? "redirecting" : "processing";

  const handlePhoneInputChange = (newValue?: string) => {
    // Simply update the state with the new value from the library
    // The react-phone-number-input library handles formatting and validation internally
    setIdentifier(newValue || "");

    // Clear any existing identifier errors when user starts typing
    if (errors.identifier) {
      setErrors((prev) => ({ ...prev, identifier: undefined }));
    }
  };

  return (
    <div className="max-w-md mx-auto relative">
      <AuthLoadingOverlay isVisible={showLoadingOverlay} state={loadingState} />
      <form onSubmit={handleSubmit} className={`space-y-5`}>
        <div className="relative">
          {identifierType === "email" ? (
            <AuthInput
              type="email"
              placeholder={i18n("emailPlaceholder") || "Email address"}
              value={identifier}
              onChange={handleIdentifierChange}
              disabled={showLoadingOverlay}
              suffix={<Mail size={16} className="text-gray-400" />}
            />
          ) : (
            <PhoneInput
              placeholder={i18n("phonePlaceholder") || "Phone number"}
              value={identifier}
              onChange={handlePhoneInputChange}
              disabled={showLoadingOverlay}
              error={errors.identifier}
            />
          )}
          <div className="mt-1 text-xs text-gray-500 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setIdentifierType(
                  identifierType === "email" ? "phone" : "email"
                );
                setIdentifier(""); // Clear identifier on type switch
                setErrors({});
              }}
              className="text-blue hover:underline"
            >
              {identifierType === "email"
                ? i18n("usePhoneInstead") || "Use phone instead"
                : i18n("useEmailInstead") || "Use email instead"}
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <AuthInput
            type="password"
            placeholder={i18n("passwordPlaceholder") || "Password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
              if (e.target.value && !showPasswordHints)
                setShowPasswordHints(true);
              if (debugInfo) setDebugInfo(null);
            }}
            showPasswordToggle
            disabled={showLoadingOverlay}
            suffix={
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowPasswordHints(!showPasswordHints)}
                aria-label="Toggle password hints"
              >
                <Info className="h-4 w-4" />
              </button>
            }
          />
          {showPasswordHints && <PasswordStrength password={password} />}
        </div>

        {(errors.identifier || errors.password) && !showLoadingOverlay && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {errors.identifier || errors.password}
          </div>
        )}
        {registerError &&
          !errors.identifier &&
          !errors.password &&
          !showLoadingOverlay && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {registerError instanceof Error
                ? getHumanReadableError(registerError.message, locale)
                : translateError("Registration failed", locale)}
            </div>
          )}

        <Button
          type="submit"
          className={`w-full rounded-full text-white py-3 md:py-4 text-sm md:text-base ${
            isFormFilled &&
            !showLoadingOverlay &&
            validateLocalIdentifier(identifier, identifierType)
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-[#AAAAAB] hover:bg-[#AAAAAB]/90"
          }`}
          disabled={!isFormFilled || showLoadingOverlay}
        >
          {showLoadingOverlay ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isRedirecting
                ? i18n("redirectingText") || "Redirecting..."
                : i18n("processingText") || "Creating account..."}
            </span>
          ) : (
            i18n("submitButton") || "Register"
          )}
        </Button>
      </form>
      <SocialAuth />
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>
          {i18n("privacyText") || "By registering, you agree to our"}{" "}
          <Link href="/privacy-policy" className="text-black">
            {i18n("privacyLink") || "Privacy Policy"}
          </Link>
        </p>
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm">
          {i18n("haveAccountText") || "Already have an account?"}{" "}
          <Link href="/auth/login" className="text-blue-600 font-medium">
            {i18n("loginLink") || "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}
