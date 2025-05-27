"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export const ForgotPasswordSuccess = () => {
  const i18n = useTranslations("forgotpasssuccess_auth.forgotPasswordSuccess");
  const [identifier, setIdentifier] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const identifierFromUrl = searchParams.get("identifier");
    if (identifierFromUrl) {
      setIdentifier(decodeURIComponent(identifierFromUrl));
    } else {
      const storedEmail = sessionStorage.getItem("resetPasswordEmail");
      const storedPhone = sessionStorage.getItem("resetPasswordPhone");

      if (storedEmail) {
        setIdentifier(storedEmail);
        sessionStorage.removeItem("resetPasswordEmail");
      } else if (storedPhone) {
        setIdentifier(storedPhone);
        sessionStorage.removeItem("resetPasswordPhone");
      }
    }
  }, [searchParams]);

  const getMessage = () => {
    if (!identifier) {
      return i18n("message");
    }

    // Check if it's an email or phone
    if (identifier.includes("@")) {
      return (
        i18n("messageWithEmail", { email: identifier }) ||
        `${i18n("message").split(" на ")[0]} на ${identifier}`
      );
    } else {
      return (
        i18n("messageWithPhone", { phone: identifier }) ||
        `${i18n("message").split(" на ")[0]} на ${identifier}`
      );
    }
  };

  return (
    <>
      <div className="w-24 h-24 relative mb-4">
        <Image
          src="/diamond_mail.webp"
          alt={i18n("alt")}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <h2 className="text-black text-xl font-semibold mb-3">{i18n("title")}</h2>
      <p className="text-gray-600 text-sm text-center mb-4">{getMessage()}</p>
    </>
  );
};

export default ForgotPasswordSuccess;
