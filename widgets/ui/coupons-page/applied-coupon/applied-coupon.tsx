"use client";

import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
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
  // Mobile version (unchanged)
  const mobileVersion = (
    <div className="space-y-4">
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center flex-col">
          <input
            type="text"
            value={couponData.code}
            readOnly
            className="flex-1 p-3 bg-white rounded-lg border border-gray-200 mr-2 w-full"
          />
          <button
            type="button"
            className="px-4 py-3 rounded-lg mt-3 w-full bg-blue text-white hover:bg-blue-600 transition-colors"
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
                width={64}
                height={64}
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

  const desktopVersion = (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-10 shadow-sm border border-gray-200">
        <div className="mb-6">
          <h3 className="text-2xl font-medium text-gray-800 mb-3 font-unbounded">
            Промокод найден
          </h3>
          <p className="text-gray-600">
            Проверьте детали промокода и нажмите "Применить" для активации
          </p>
        </div>

        <div className="flex items-center flex-row gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 bg-blue-100 rounded-lg opacity-20"></div>
            <input
              type="text"
              value={couponData.code}
              readOnly
              className="w-full p-4 bg-white rounded-lg border border-blue-200 text-lg text-center font-medium text-blue-700"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Check size={20} className="text-green-500" />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="px-8 py-4 rounded-lg w-auto whitespace-nowrap bg-blue text-white hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
            onClick={onActivate}
          >
            Применить
          </motion.button>
        </div>
      </div>

      {couponData.game && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden mr-6 shadow-md">
                <Image
                  src="/mlbb-icon.png"
                  alt={couponData.game}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 mb-1">
                  {couponData.game}
                </h4>
                <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm inline-block">
                  <Check size={14} className="mr-1" />
                  <span>Скидка: {couponData.discount}%</span>
                </div>
              </div>
            </div>

            {couponData.minAmount && (
              <div className="flex items-start max-w-[250px] bg-blue-50 p-3 rounded-lg">
                <Info
                  size={16}
                  className="text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-blue-700">
                  Минимальная сумма для покупки составляет{" "}
                  {couponData.minAmount.toLocaleString()} рублей
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Условия использования:
            </h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Промокод действует до 31.12.2025</li>
              <li>• Можно использовать только один раз</li>
              <li>• Не суммируется с другими акциями</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <>
      <div className="block md:hidden">{mobileVersion}</div>
      <div className="hidden md:block">{desktopVersion}</div>
    </>
  );
}
