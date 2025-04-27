import google from "@/assets/google_icon.svg";
import Image from "next/image";

export function SocialAuth() {
  return (
    <div className="w-full">
      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-gray-200"></div>
        <p className="mx-4 text-xs text-gray-400">или войдите с помощью</p>
        <div className="flex-grow h-px bg-gray-200"></div>
      </div>
      <div className="flex justify-center space-x-4">
        <button className="p-2 w-[80px] h-[80px] flex items-center justify-center border-gray-200 rounded-full bg-[#F3F4F7]">
          <Image src={google} alt="Google" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
