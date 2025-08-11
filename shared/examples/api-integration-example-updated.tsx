// Пример использования новых API эндпоинтов с apiClient

import { CurrencySelector } from "@/entities/currency/ui/currency-selector";
import { EnhancedPaymentMethodSelector } from "@/entities/payment/ui/enhanced-payment-method-selector";
import { useUpdateUserCurrency } from "@/entities/currency/hooks/use-update-user-currency";
import { usePaymentMethods } from "@/entities/payment/hooks/use-payment-methods";
import { useState } from "react";
import type { PaymentMethod } from "@/entities/payment/api/payment-methods-api";

export function OrderPageExample() {
  const [selectedCurrency, setSelectedCurrency] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [currentCurrencyCode, setCurrentCurrencyCode] = useState("USD");
  const [region, setRegion] = useState("North America");
  const [orderAmount, setOrderAmount] = useState(1000);

  // Хуки для работы с API (используют apiClient)
  const { updateCurrency, isUpdating, error } = useUpdateUserCurrency();
  const {
    paymentMethods,
    recommendedMethods,
    fallbackMethods,
    userInfo,
    isLoading,
    refetch,
  } = usePaymentMethods({
    currency: currentCurrencyCode,
    region: region,
    amount: orderAmount,
  });

  const handleCurrencyChange = async (currencyId: number) => {
    setSelectedCurrency(currencyId);

    // Определяем код валюты по ID (это пример, в реальности используйте ваши данные)
    const currencyMap: Record<number, { code: string; region: string }> = {
      1: { code: "RUB", region: "Russia" },
      2: { code: "USD", region: "North America" },
      3: { code: "EUR", region: "Europe" },
    };

    const currencyInfo = currencyMap[currencyId];
    if (currencyInfo) {
      setCurrentCurrencyCode(currencyInfo.code);
      setRegion(currencyInfo.region);

      // Обновляем валюту пользователя через API (используя apiClient)
      await updateCurrency({
        preferred_currency: currencyInfo.code,
        country_code: currencyInfo.region,
      });

      // Перезагружаем методы платежа для новой валюты
      refetch({
        currency: currencyInfo.code,
        region: currencyInfo.region,
        amount: orderAmount,
      });
    }
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    console.log("Selected payment method:", method);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900">
        API Integration Example - Payment Methods
      </h1>

      {/* Селектор валюты с API интеграцией */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Currency Selection</h2>
        <CurrencySelector
          options={[
            { id: 1, amount: 100, price: "₽100", priceValue: 100 },
            { id: 2, amount: 200, price: "$200", priceValue: 200 },
            { id: 3, amount: 500, price: "€500", priceValue: 500 },
          ]}
          currencyName={currentCurrencyCode}
          currencyImage={`/${currentCurrencyCode.toLowerCase()}.png`}
          selectedId={selectedCurrency}
          onSelect={handleCurrencyChange}
          enableUserUpdate={true}
          currencyCode={currentCurrencyCode}
          enhanced={true}
        />
      </div>

      {/* Новый селектор методов платежа с API интеграцией */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Payment Methods (New API Structure)
        </h2>
        <EnhancedPaymentMethodSelector
          selectedMethod={selectedPaymentMethod?.id}
          onSelect={handlePaymentMethodSelect}
          currentCurrency={currentCurrencyCode}
          region={region}
          amount={orderAmount}
          showRecommended={true}
          showFallback={true}
        />
      </div>

      {/* Показываем состояние загрузки */}
      {(isUpdating || isLoading) && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700">
            {isUpdating
              ? "Обновляем валюту пользователя..."
              : "Загружаем методы платежа..."}
          </p>
        </div>
      )}

      {/* Показываем ошибки */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">Ошибка: {error}</p>
        </div>
      )}

      {/* Информация о пользователе из API */}
      {userInfo && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">
            User Info from API:
          </h3>
          <div className="text-sm text-green-700 space-y-1">
            <p>
              <strong>Currency:</strong> {userInfo.currency}
            </p>
            <p>
              <strong>Region:</strong> {userInfo.region}
            </p>
            <p>
              <strong>Country:</strong> {userInfo.country || "Not specified"}
            </p>
          </div>
        </div>
      )}

      {/* Показываем выбранный метод платежа */}
      {selectedPaymentMethod && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="font-medium text-purple-800 mb-2">
            Selected Payment Method:
          </h3>
          <div className="text-sm text-purple-700 space-y-1">
            <p>
              <strong>ID:</strong> {selectedPaymentMethod.id}
            </p>
            <p>
              <strong>Name:</strong> {selectedPaymentMethod.name}
            </p>
            <p>
              <strong>Type:</strong> {selectedPaymentMethod.type}
            </p>
            <p>
              <strong>Currency:</strong> {selectedPaymentMethod.currency}
            </p>
            <p>
              <strong>Region:</strong> {selectedPaymentMethod.region}
            </p>
            {selectedPaymentMethod.processing_fee && (
              <p>
                <strong>Processing Fee:</strong>{" "}
                {selectedPaymentMethod.processing_fee}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Показываем доступные методы платежа из API */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Recommended Methods */}
        {recommendedMethods.length > 0 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">
              Recommended Methods ({recommendedMethods.length}):
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              {recommendedMethods.map((method) => (
                <li key={method.id} className="flex justify-between">
                  <span>{method.name}</span>
                  <span className="text-orange-600">
                    {method.processing_fee}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* All Methods */}
        {paymentMethods.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">
              Available Methods ({paymentMethods.length}):
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              {paymentMethods.map((method) => (
                <li key={method.id} className="flex justify-between">
                  <span>{method.name}</span>
                  <span className="text-orange-600">
                    {method.processing_fee}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Fallback Methods */}
        {fallbackMethods.length > 0 && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">
              Fallback Options ({fallbackMethods.length}):
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {fallbackMethods.map((method, index) => (
                <li key={index}>{method}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
