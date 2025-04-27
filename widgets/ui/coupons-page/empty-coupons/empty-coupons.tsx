"use client";

import diamond from "@/assets/sad-icon.webp";
import Image from "next/image";

interface EmptyCouponsWidgetProps {
  onShowInput: () => void;
}

export function EmptyCouponsWidget({ onShowInput }: EmptyCouponsWidgetProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center">
      <div className="mb-4">
        <Image src={diamond} alt="No coupons" width={80} height={80} />
      </div>
      <h3 className="font-medium text-lg mb-2">У вас еще нет купонов</h3>
      <p className="text-sm text-gray-600 mb-4">
        Получайте купоны со скидками
        <br />
        за покупки
      </p>
      <button
        onClick={onShowInput}
        className="px-6 py-3 bg-blue text-white rounded-full font-medium mt-2"
      >
        Ввести промокод
      </button>
    </div>
  );
}
