import tbank from "@/assets/T-Bank.webp";
import Image from "next/image";

export function PaymentMethodSelector() {
  return (
    <div className="px-4 mb-6">
      <h2 className="text-dark text-[16px] font-roboto font-medium mb-4">
        3 ВЫБЕРИТЕ СПОСОБ ОПЛАТЫ
      </h2>
      <div className="border border-gray-200 rounded-[12px] p-3 gap-2 flex items-center">
        <Image src={tbank.src} width={36} height={36} alt="T-bank" />
        <span className="text-[13px] font-bold font-roboto">T-Bank (SBP)</span>
      </div>
    </div>
  );
}
