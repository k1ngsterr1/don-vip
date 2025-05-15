import BoxIcon from "@/shared/icons/box-icon";
import { ArrowLeft, Link } from "lucide-react";
import Image from "next/image";
import React from "react";

export const ProfilePurchasesBlock = () => {
  return (
    <div className="">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link
            href={"/"}
            className="text-blue-600 hover:text-blue-700 transition-colors flex items-center group"
          >
            <ArrowLeft
              size={16}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-base">Вернуться</span>
          </Link>
        </div>
      </div>
      <div className="w-full flex items-start justify-start gap-2">
        <div className="w-[20px] h-[20px] bg-[#F03D00] font-condensed">
          <BoxIcon width={11} height={9} color="white" />
        </div>
        <h1 className="text-base font-unbounded">Покупки</h1>
      </div>
      <div className="w-full bg-[#F3F4F7] rounded-[8px] flex flex-col items-center justify-center">
        <Image
          src="/sad_diamond.webp"
          alt="Sad Diamond"
          className="w-[58px] h-[55px]"
        />
        <span className="text-[13px] font-roboto text-black">
          Вы еще не сделали покупки
        </span>
      </div>
    </div>
  );
};
