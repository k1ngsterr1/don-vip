import Image from "next/image";

interface PaymentMethodSelectorProps {
  enhanced?: boolean;
}

export function PaymentMethodSelector({
  enhanced = false,
}: PaymentMethodSelectorProps) {
  const paymentMethods = [
    { id: "tbank", name: "T-Bank (SBP)", icon: "/assets/T-Bank.webp" },
    { id: "card", name: "Банковская карта", icon: "/credit-card-icon.png" },
    { id: "qiwi", name: "QIWI", icon: "/qiwi-icon.png" },
  ];

  // Mobile version (unchanged)
  const mobileSelector = (
    <div className={enhanced ? "hidden" : "px-4 mb-6"}>
      <h2 className="text-dark font-medium mb-4">3 ВЫБЕРИТЕ СПОСОБ ОПЛАТЫ</h2>
      <div className="border border-gray-200 rounded-lg p-3 flex items-center">
        <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center mr-3">
          <span className="text-white font-bold">₸</span>
        </div>
        <span>T-Bank (SBP)</span>
      </div>
    </div>
  );

  // Desktop version
  const desktopSelector = (
    <div className={enhanced ? "" : "hidden"}>
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        3. Выберите способ оплаты
      </h2>
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border border-gray-200 rounded-lg p-4 flex items-center cursor-pointer transition-all ${
              method.id === "tbank"
                ? "bg-blue/5 border-blue"
                : "hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="w-10 h-10 rounded-md flex items-center justify-center mr-4 bg-gray-100">
              {method.icon ? (
                <Image
                  src={method.icon || "/placeholder.svg"}
                  width={24}
                  height={24}
                  alt={method.name}
                />
              ) : (
                <span className="text-gray-700 font-bold">₸</span>
              )}
            </div>
            <div className="flex-1">
              <span className="font-medium text-gray-800">{method.name}</span>
              {method.id === "tbank" && (
                <p className="text-xs text-gray-500 mt-1">
                  Быстрый и безопасный способ оплаты
                </p>
              )}
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
              {method.id === "tbank" && (
                <div className="w-3 h-3 rounded-full bg-blue"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {mobileSelector}
      {desktopSelector}
    </>
  );
}
