"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function PaymentFailedWidget() {
  const t = useTranslations("payment_failed");

  const mobileVersion = (
    <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
      <div className="mb-4">
        <Image
          src={"/sad_diamond.webp"}
          alt={t("imageAlt")}
          width={80}
          height={80}
        />
      </div>
      <h3 className="font-medium text-lg mb-2 text-red-600">{t("title")}</h3>
      <p className="text-sm text-gray-600 mb-2">{t("description")}</p>
      <div className="mt-4 flex flex-col gap-2 w-full">
        <Link
          href="/"
          className="w-full px-4 py-2 !bg-blue-600 text-white rounded-lg text-sm font-medium  transition-colors"
        >
          {t("retryPayment")}
        </Link>
      </div>
    </div>
  );

  const desktopVersion = (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 flex flex-col items-center text-center shadow-sm border border-gray-200">
      <div className="mb-8 relative">
        <div className="absolute -inset-4 bg-red-50 rounded-full opacity-70 blur-xl"></div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Image
            src={"/sad_diamond.webp"}
            alt={t("imageAlt")}
            width={120}
            height={120}
            className="drop-shadow-md"
          />
        </motion.div>
      </div>
      <h3 className="font-medium text-2xl mb-4 font-unbounded text-red-600">
        {t("title")}
      </h3>
      <p className="text-lg text-gray-600 mb-4 max-w-md">{t("description")}</p>

      <div className="mt-6 flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium  transition-colors"
        >
          {t("retryPayment")}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <div className="block md:hidden">{mobileVersion}</div>
      <div className="hidden md:block">{desktopVersion}</div>
    </>
  );
}
