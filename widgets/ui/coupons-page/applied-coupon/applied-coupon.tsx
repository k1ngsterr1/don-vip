"use client";

import Image from "next/image";

interface CouponData {
  code: string;
  game?: string;
  discount: number;
  minAmount?: number;
}

interface AppliedCouponWidgetProps {
  couponData: CouponData;
  onActivate: () => void;
}

export function AppliedCouponWidget({
  couponData,
  onActivate,
}: AppliedCouponWidgetProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center">
          <input
            type="text"
            value={couponData.code}
            readOnly
            className="flex-1 p-3 bg-white rounded-lg border border-gray-200 mr-2"
          />
          <button
            type="button"
            className="px-4 py-3 rounded-lg bg-blue text-white"
            onClick={onActivate}
          >
            Применить
          </button>
        </div>
      </div>

      {couponData.game && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
              <Image
                src="/mlbb-icon.png"
                alt={couponData.game}
                width={48}
                height={48}
              />
            </div>
            <div>
              <p className="text-blue">{couponData.game}</p>
              <p className="font-medium">Скидка: {couponData.discount}%</p>
            </div>
          </div>
          {couponData.minAmount && (
            <p className="text-xs text-gray-500 mt-2">
              Внимание! Минимальная сумма для покупки составляет{" "}
              {couponData.minAmount.toLocaleString()} рублей
            </p>
          )}
        </div>
      )}
    </div>
  );
}
