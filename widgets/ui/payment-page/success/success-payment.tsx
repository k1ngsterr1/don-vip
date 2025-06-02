"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

type PaymentSuccessWidgetProps = {
  orderNumber?: string;
  amount?: string;
};

export function PaymentSuccessWidget({
  orderNumber,
  amount,
}: PaymentSuccessWidgetProps) {
  const t = useTranslations("payment_success");

  const mobileVersion = (
    <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
      <div className="mb-4">
        <Image
          src={"/register_diamond.webp"}
          alt={t("imageAlt")}
          width={80}
          height={80}
        />
      </div>
      <h3 className="font-medium text-lg mb-2">{t("title")}</h3>
      <p className="text-sm text-gray-600 mb-2">{t("description")}</p>
      <Link
        href="/"
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t("returnToMainPage")}
      </Link>
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
            src={"/register_diamond.webp"}
            alt={t("imageAlt")}
            width={120}
            height={120}
            className="drop-shadow-md"
          />
        </motion.div>
      </div>
      <h3 className="font-medium text-2xl mb-4 font-unbounded text-gray-800">
        {t("title")}
      </h3>
      <p className="text-lg text-gray-600 mb-4 max-w-md">{t("description")}</p>
      <Link
        href="/"
        className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {t("returnToMainPage")}
      </Link>
    </div>
  );

  return (
    <>
      <div className="block md:hidden">{mobileVersion}</div>
      <div className="hidden md:block">{desktopVersion}</div>
    </>
  );
}
