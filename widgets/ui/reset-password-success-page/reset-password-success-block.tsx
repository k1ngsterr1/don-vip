"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/entities/auth/store/auth.store";

export function ResetPasswordSuccessWidget() {
  const t = useTranslations("forgotpasssuccess_auth");
  const user = useAuthStore((state) => state.user);
  const email = user?.email || "";

  const mobileVersion = (
    <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
      <div className="mb-4">
        <Image
          src={"/diamond_mail.webp"}
          alt={t("forgotPasswordSuccess.alt")}
          width={80}
          height={80}
        />
      </div>
      <h3 className="font-medium text-lg mb-2">
        {t("forgotPasswordSuccess.title")}
      </h3>
      <p className="text-sm text-gray-600 mb-2">
        {t("forgotPasswordSuccess.message")}
      </p>
      {email && <p className="text-sm text-blue-600 font-medium">{email}</p>}
    </div>
  );

  const desktopVersion = (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 flex flex-col items-center text-center shadow-sm border border-gray-200">
      <div className="mb-8 relative">
        <div className="absolute -inset-4 bg-blue-50 rounded-full opacity-70 blur-xl"></div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Image
            src={"/diamond_mail.webp"}
            alt={t("forgotPasswordSuccess.alt")}
            width={120}
            height={120}
            className="drop-shadow-md"
          />
        </motion.div>
      </div>
      <h3 className="font-medium text-2xl mb-4 font-unbounded text-gray-800">
        {t("forgotPasswordSuccess.title")}
      </h3>
      <p className="text-lg text-gray-600 mb-4 max-w-md">
        {t("forgotPasswordSuccess.message")}
      </p>
      {email && <p className="text-md text-blue-700 font-semibold">{email}</p>}
    </div>
  );

  return (
    <>
      <div className="block md:hidden">{mobileVersion}</div>
      <div className="hidden md:block">{desktopVersion}</div>
    </>
  );
}
