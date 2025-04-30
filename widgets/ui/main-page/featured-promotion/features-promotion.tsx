import Image from "next/image";
import Link from "next/link";

export function FeaturedPromotion() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 shadow-sm">
      <div className="flex items-center">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue mb-1">
            Специальное предложение
          </h3>
          <p className="text-xs text-gray-700 mb-2">
            Получите скидку 10% на первый заказ
          </p>
          <Link
            href="/promo"
            className="inline-block text-xs bg-blue text-white px-3 py-1 rounded-full"
          >
            Подробнее
          </Link>
        </div>
        <div className="w-16 h-16 relative">
          <Image
            src="/special-offer-icon.png"
            alt="Специальное предложение"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
