"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

type PasswordStrengthProps = {
  password: string;
  className?: string;
};

export function PasswordStrength({
  password,
  className = "",
}: PasswordStrengthProps) {
  const i18n = useTranslations("password_strength");
  const [strength, setStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    const totalCriteria = [
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    ].filter(Boolean).length;

    // Calculate score based on criteria met (0-4)
    let score = 0;
    if (totalCriteria === 1) score = 1; // Weak
    else if (totalCriteria === 2) score = 2; // Fair
    else if (totalCriteria === 3) score = 2; // Fair
    else if (totalCriteria === 4) score = 3; // Good
    else if (totalCriteria === 5) score = 4; // Strong

    setStrength({
      score,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    });
  }, [password]);

  const getStrengthText = () => {
    if (password.length === 0) return "";
    if (strength.score === 0) return i18n("veryWeak");
    if (strength.score === 1) return i18n("weak");
    if (strength.score === 2) return i18n("fair");
    if (strength.score === 3) return i18n("good");
    return i18n("strong");
  };

  const getStrengthColor = () => {
    if (password.length === 0) return "bg-gray-200";
    if (strength.score === 0) return "bg-red-500";
    if (strength.score === 1) return "bg-red-500";
    if (strength.score === 2) return "bg-yellow-500";
    if (strength.score === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const criteria = [
    { label: i18n("minLength"), met: strength.hasMinLength },
    { label: i18n("uppercase"), met: strength.hasUppercase },
    { label: i18n("lowercase"), met: strength.hasLowercase },
    { label: i18n("number"), met: strength.hasNumber },
    { label: i18n("specialChar"), met: strength.hasSpecialChar },
  ];

  if (password.length === 0) return null;

  return (
    <div className={`mt-2 space-y-2 text-sm ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">
            {i18n("passwordStrength")}
          </span>
          <span
            className={`text-xs font-medium ${getStrengthColor().replace(
              "bg-",
              "text-"
            )}`}
          >
            {getStrengthText()}
          </span>
        </div>
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getStrengthColor()} transition-all duration-300 ease-in-out`}
            style={{ width: `${(strength.score / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-center gap-1">
            {criterion.met ? (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-gray-400" />
            )}
            <span
              className={`text-xs ${
                criterion.met ? "text-green-700" : "text-gray-600"
              }`}
            >
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
