"use client";

import Image from "next/image";

interface ActivatedCouponWidgetProps {
  onGoToStore: () => void;
}

export function ActivatedCouponWidget({
  onGoToStore,
}: ActivatedCouponWidgetProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center">
      <div className="mb-4">
        <Image
          src="/happy-triangle.png"
          alt="Coupon activated"
          width={80}
          height={80}
        />
      </div>
      <h3 className="font-medium text-lg mb-2">Промокод активирован</h3>
      <p className="text-sm text-gray-600 mb-4">
        Наслаждайтесь скидками и приятных покупок!
      </p>
      <button
        onClick={onGoToStore}
        className="px-6 py-3 bg-blue text-white rounded-full font-medium"
      >
        В магазин
      </button>
    </div>
  );
}
