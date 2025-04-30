"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface ActivatedCouponWidgetProps {
  onGoToStore: () => void;
}

export function ActivatedCouponWidget({
  onGoToStore,
}: ActivatedCouponWidgetProps) {
  // Mobile version (unchanged)
  const mobileVersion = (
    <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
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
        className="px-6 py-3 bg-blue text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
      >
        В магазин
      </button>
    </div>
  );

  // Desktop version (enhanced)
  const desktopVersion = (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-12 flex flex-col items-center text-center shadow-md border border-blue-200">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-blue-200 rounded-full opacity-30 blur-xl"></div>
        <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
          <Image
            src="/Ok.webp"
            alt="Success"
            width={100}
            height={100}
            className="w-20 h-20 object-contain"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-medium text-3xl mb-4 font-unbounded text-blue-800">
          Промокод активирован!
        </h3>
        <p className="text-lg text-blue-700 mb-8 max-w-md">
          Ваша скидка успешно применена. Наслаждайтесь покупками по выгодным
          ценам!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGoToStore}
          className="px-8 py-4 bg-blue-600 text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 flex items-center mx-auto"
        >
          <ShoppingCart size={20} className="mr-2" />
          <span>Перейти в магазин</span>
        </motion.button>

        <div className="mt-8 pt-6 border-t border-blue-200 max-w-md mx-auto">
          <p className="text-blue-700 text-sm">
            Скидка будет автоматически применена при оформлении заказа. Спасибо,
            что выбрали наш сервис!
          </p>
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      <div className="block md:hidden">{mobileVersion}</div>
      <div className="hidden md:block">{desktopVersion}</div>
    </>
  );
}
