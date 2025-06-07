"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { Button } from "@/shared/ui/button/button"; // Assuming this is your Button component
import { useRouter } from "next/navigation";

export function AuthSuccessWidget() {
  const t = useTranslations("auth_success");
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const router = useRouter();

  const handleGoToProfile = () => {
    if (userId) {
      router.push(`/profile/${userId}/edit`);
    } else {
      // Fallback if user.id is somehow not available
      console.error("User ID not found for profile redirection.");
      router.push("/"); // Or some other appropriate fallback
    }
  };

  const mobileVersion = (
    <div className="w-full bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
      <div className="mb-4">
        <Image
          src="/diamond_mail.webp" // Ensure this image is in your public folder
          alt={t("empty.imageAlt")}
          width={80}
          height={80}
        />
      </div>
      <h3 className="font-medium text-lg mb-2">{t("title")}</h3>
      <p className="text-sm text-gray-600 mb-2">{t("description")}</p>

      <div className="w-full space-y-3">
        <Button
          onClick={handleGoToProfile}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!userId}
        >
          Перейти в личный кабинет
        </Button>
      </div>
    </div>
  );

  const desktopVersion = (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 flex flex-col items-center text-center shadow-sm border border-gray-200">
      <div className="mb-8 relative">
        <div className="absolute -inset-4 bg-blue-50 rounded-full opacity-70 blur-xl"></div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Image
            src="/diamond_mail.webp" // Ensure this image is in your public folder
            alt={t("empty.imageAlt")}
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

      <div className="w-full max-w-xs space-y-4">
        <Button
          onClick={handleGoToProfile}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-md"
          disabled={!userId}
        >
          Перейти в личный кабинет
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="block md:hidden w-full">{mobileVersion}</div>
      <div className="hidden md:block w-full">{desktopVersion}</div>
    </>
  );
}
