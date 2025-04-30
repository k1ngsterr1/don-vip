"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const SuccessfulRegistration = () => {
  const i18n = useTranslations("registersuccess_auth.registrationSuccess");

  return (
    <div className="w-[343px] bg-[#F3F4F7] rounded-[12px] flex items-center justify-center flex-col">
      <Image src="/register-diamond.webp" alt={i18n("imageAlt")} unoptimized />
      <span className="text-black text-[16px] mt-[19px]">{i18n("title")}</span>
      <span className="text-black text-[13px] mt-[15.5px]">
        {i18n("message")}
      </span>
    </div>
  );
};
