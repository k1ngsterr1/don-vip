"use client";

import google from "@/assets/google.webp";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function SocialAuth() {
  const t = useTranslations();

  return (
    <div className="w-full mt-[24px] md:mt-8">
      <div className="flex w-full justify-center items-center my-4">
        <p className="mx-4 text-[13px] md:text-sm text-gray-400 text-center">
          {t("social_auth.login_with")}
        </p>
      </div>
      <div className="flex justify-center space-x-4">
        <button className="p-2 w-[80px] h-[80px] md:w-[90px] md:h-[90px] flex items-center justify-center border-gray-200 rounded-full bg-[#F3F4F7] hover:bg-gray-100 transition-colors">
          <Image
            src={google || "/placeholder.svg"}
            alt="Google"
            width={24}
            height={24}
            className="md:w-7 md:h-7"
          />
        </button>
      </div>
    </div>
  );
}
