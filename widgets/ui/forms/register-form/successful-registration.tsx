import Image from "next/image";

export const SuccessfulRegistration = () => {
  return (
    <div className="w-[343px] bg-[#F3F4F7] rounded-[12px] flex items-center justify-center flex-col">
      <Image src="/register-diamond.webp" alt="register" />
      <span className="text-black text-[16px] mt-[19px]">
        Благодарим за регистрацию
      </span>
      <span className="text-black text-[13px] mt-[15.5px]">
        Ссылка для активации профиля отправлена на вашу почту
      </span>
    </div>
  );
};
