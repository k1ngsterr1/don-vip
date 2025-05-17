"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ForgotPasswordSuccess = () => {
  const i18n = useTranslations("forgotpasssuccess_auth.forgotPasswordSuccess");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get the email from sessionStorage if available
    const storedEmail = sessionStorage.getItem("resetPasswordEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      // Clear it after retrieving
      sessionStorage.removeItem("resetPasswordEmail");
    }
  }, []);

  return (
    <div className="w-full max-w-md bg-[#F3F4F7] rounded-[12px] flex items-center justify-center flex-col p-6 md:p-8">
      <div className="w-24 h-24 relative mb-4">
        <Image
          src="/register-diamond.webp"
          alt={i18n("alt")}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <h2 className="text-black text-xl font-semibold mb-3">{i18n("title")}</h2>
      <p className="text-black text-center mb-6">
        {email
          ? i18n.rich("messageWithEmail", { email: <strong>{email}</strong> })
          : i18n("message")}
      </p>

      <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
        <Link
          href="/auth/login"
          className="w-full py-3 bg-blue text-white text-center rounded-full hover:bg-blue/90 transition-colors"
        >
          {i18n("loginButton")}
        </Link>

        <Link
          href="/"
          className="w-full py-3 bg-gray-200 text-gray-800 text-center rounded-full hover:bg-gray-300 transition-colors"
        >
          {i18n("homeButton")}
        </Link>
      </div>
    </div>
  );
};
