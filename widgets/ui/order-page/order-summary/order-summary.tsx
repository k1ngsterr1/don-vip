import { cn } from "@/shared/utils/cn";
import { Check, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface OrderSummaryProps {
  game: any;
  selectedCurrency: any;
  isFormValid: boolean;
  userId: string;
  serverId: string;
}

export function OrderSummary({
  game,
  selectedCurrency,
  isFormValid,
  userId,
  serverId,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 sticky top-8">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Ваш заказ</h2>

        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 bg-gray-100 flex-shrink-0">
            {game.currencyImage && (
              <Image
                src={game.currencyImage || "/placeholder.svg"}
                alt={game.currencyName}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{game.name}</h3>
            <p className="text-sm text-gray-500">{game.currencyName}</p>
          </div>
        </div>

        {selectedCurrency && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Количество:</span>
              <span className="font-medium">
                {selectedCurrency.amount} {game.currencyName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Стоимость:</span>
              <span className="font-medium">{selectedCurrency.price}</span>
            </div>
          </div>
        )}

        {userId && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Информация пользователя:
            </h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-gray-600 text-sm">ID:</span>
                <span className="ml-2 font-medium text-sm">{userId}</span>
              </div>
              {serverId && (
                <div className="flex items-center mt-1">
                  <span className="text-gray-600 text-sm">Сервер:</span>
                  <span className="ml-2 font-medium text-sm">{serverId}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <button
          className={cn(
            "w-full py-3 px-4 rounded-lg text-white font-medium transition-colors",
            isFormValid ? "bg-blue hover:bg-blue-600" : "bg-gray-400"
          )}
          disabled={!isFormValid}
        >
          Купить сейчас
        </button>

        <div className="mt-4 flex items-start">
          <ShieldCheck
            className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
            size={16}
          />
          <p className="text-xs text-gray-500">
            Ваш платеж защищен. Мы используем современные технологии шифрования
            для обеспечения безопасности ваших данных.
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <Check className="text-green-500 mr-2" size={14} />
            <span className="text-xs text-gray-600">Мгновенная доставка</span>
          </div>
          <div className="flex items-center">
            <Check className="text-green-500 mr-2" size={14} />
            <span className="text-xs text-gray-600">Поддержка 24/7</span>
          </div>
          <div className="flex items-center">
            <Check className="text-green-500 mr-2" size={14} />
            <span className="text-xs text-gray-600">Безопасная оплата</span>
          </div>
        </div>
      </div>
    </div>
  );
}
