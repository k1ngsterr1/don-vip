"use client";

import diamond from "@/assets/sad-icon.webp";
import { motion } from "framer-motion";
import Image from "next/image";

interface EmptyCouponsWidgetProps {
  onShowInput: () => void;
}

export function EmptyCouponsWidget({ onShowInput }: EmptyCouponsWidgetProps) {
  // Mobile version (unchanged)
  const mobileVersion = (
    <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
      <div className="mb-4">
        <Image
          src={diamond || "/placeholder.svg"}
          alt="No coupons"
          width={80}
          height={80}
        />
      </div>
      <h3 className="font-medium text-lg mb-2">У вас еще нет купонов</h3>
      <p className="text-sm text-gray-600 mb-4">
        Получайте купоны со скидками
        <br />
        за покупки
      </p>
      <button
        onClick={onShowInput}
        className="px-6 py-3 bg-blue text-white rounded-full font-medium mt-2 hover:bg-blue-600 transition-colors"
      >
        Ввести промокод
      </button>
    </div>
  );

  // Desktop version (enhanced)
  const desktopVersion = (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 flex flex-col items-center text-center shadow-sm border border-gray-200">
      <div className="mb-8 relative">
        <div className="absolute -inset-4 bg-blue-50 rounded-full opacity-70 blur-xl"></div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Image
            src={diamond || "/placeholder.svg"}
            alt="No coupons"
            width={120}
            height={120}
            className="drop-shadow-md"
          />
        </motion.div>
      </div>
      <h3 className="font-medium text-2xl mb-4 font-unbounded text-gray-800">
        У вас еще нет купонов
      </h3>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Получайте купоны со скидками за покупки и используйте их для экономии на
        будущих заказах
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onShowInput}
        className="px-8 py-4 bg-blue text-white rounded-full font-medium text-lg shadow-md hover:shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center"
      >
        <span className="mr-2">Ввести промокод</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"
            fill="white"
          />
        </svg>
      </motion.button>
    </div>
  );

  return (
    <>
      <div className="block md:hidden">{mobileVersion}</div>
      <div className="hidden md:block">{desktopVersion}</div>
    </>
  );
}
