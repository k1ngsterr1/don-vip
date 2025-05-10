"use client";

import { CurrencySelector } from "@/entities/currency/ui/currency-selector";
import { PaymentMethodSelector } from "@/entities/payment/ui/payment-method-selector";
import { cn } from "@/shared/utils/cn";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Banner } from "./banner/banner";
import { OrderSummary } from "./order-summary/order-summary";
import { ProductInfo } from "./product-info/product-info";
import { UserIdForm } from "./user-id-form/user-id-form";
import { useCreateOrder } from "@/entities/order/hooks/use-create-order";
import type { CreateOrderDto } from "@/entities/order/model/types";
import { useProduct } from "@/entities/product/hooks/queries/use-product";
import { OrderBlockSkeleton } from "./loading/skeleton-loading";

interface OrderBlockProps {
  gameSlug: number;
  initialExpandInfo?: boolean;
}

interface GameData {
  id: number;
  name: string;
  description: string;
  image: string;
  currencyName: string;
  currencyImage: string;
  requiresServer: boolean;
}

interface CurrencyOption {
  id: number;
  amount: number;
  price: string;
  type: string;
  sku: string;
}

export function OrderBlock({
  gameSlug,
  initialExpandInfo = false,
}: OrderBlockProps) {
  const t = useTranslations("orderBlock");
  const { data: product, isLoading: isProductLoading } = useProduct(gameSlug);

  const [game, setGame] = useState<GameData | null>(null);
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const [showInfo, setShowInfo] = useState(initialExpandInfo);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("tbank");

  const { createOrder, isLoading, isProcessingPayment, error, setError } =
    useCreateOrder();

  useEffect(() => {
    if (product) {
      let replenishmentArray = [];

      try {
        if (typeof product.replenishment === "string") {
          replenishmentArray = JSON.parse(product.replenishment);
        } else if (Array.isArray(product.replenishment)) {
          replenishmentArray = product.replenishment;
        }
      } catch (error) {
        console.error("Error parsing replenishment data:", error);
        replenishmentArray = [];
      }

      // Get the currency type from the first replenishment item if available
      const currencyType =
        replenishmentArray.length > 0 ? replenishmentArray[0].type : "";

      // Capitalize the first letter of the currency type for display
      const formattedCurrencyName = currencyType
        ? currencyType.charAt(0).toUpperCase() + currencyType.slice(1)
        : product.type === "Bigo"
        ? "Diamonds"
        : "Coins";

      setGame({
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        currencyName: formattedCurrencyName,
        currencyImage: `/currency-${product.type.toLowerCase()}.png`, // Use product type for image path
        requiresServer: product.type === "Smile",
      });

      setCurrencyOptions(
        replenishmentArray.map((item: any, index: number) => ({
          id: index,
          amount: item.amount,
          price: `${item.price.toFixed(2)} RUB`, // Format price with currency
          type: item.type, // Keep the original type from replenishment
          sku: item.sku,
        }))
      );
    }
  }, [product]);

  // If game data is not loaded yet, show loading state
  if (isProductLoading || !game) {
    return <OrderBlockSkeleton />;
  }

  const isFormValid =
    selectedAmount !== null &&
    userId !== "" &&
    agreeToTerms &&
    (!game.requiresServer || serverId !== "");

  // Find the selected currency option to display in the summary
  const selectedCurrency =
    selectedAmount !== null ? currencyOptions[selectedAmount] : null;

  const handleSubmitOrder = () => {
    if (!isFormValid || !selectedCurrency) {
      setError(t("errors.invalidForm"));
      return;
    }

    // Extract the numeric value from the price string (remove currency symbols)
    const numericPrice = selectedCurrency.price.replace(/[^0-9.]/g, "");

    // Ensure it has 2 decimal places
    const formattedPrice = Number(numericPrice).toFixed(2);

    const orderData: CreateOrderDto = {
      price: formattedPrice as any, // Format price as a decimal string with 2 decimal places
      amount: selectedCurrency.amount,
      //@ts-ignore
      type: selectedCurrency.type, // Use the type directly from the selected currency option
      payment: selectedPaymentMethod,
      account_id: userId, // Use userId as account_id
      //@ts-ignore
      server_id: product.type === "Smile" ? serverId : undefined, // Only include server_id for Smile products
    };

    console.log("Submitting order with type:", selectedCurrency.type); // Log for debugging
    createOrder(orderData);
  };

  // Mobile version
  const mobileVersion = (
    <div className="md:hidden">
      <Banner backgroundImage={game.image || "/banner.png"} height="112px" />
      <ProductInfo
        isExpanded={showInfo}
        onToggle={() => setShowInfo(!showInfo)}
        description={game.description}
      />
      <CurrencySelector
        //@ts-ignore
        options={currencyOptions}
        currencyName={game.currencyName}
        currencyImage={game.currencyImage}
        onSelect={setSelectedAmount}
        selectedId={selectedAmount}
      />
      <UserIdForm
        requiresServer={game.requiresServer}
        userId={userId}
        serverId={serverId}
        agreeToTerms={agreeToTerms}
        onUserIdChange={setUserId}
        onServerIdChange={setServerId}
        onAgreeChange={setAgreeToTerms}
      />
      <PaymentMethodSelector
        onSelect={setSelectedPaymentMethod}
        selectedMethod={selectedPaymentMethod}
      />

      {error && (
        <div className="px-4 mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      <div className="fixed bottom-16 right-[16px] px-4 py-2">
        <button
          className={cn(
            "w-[140px] py-3 px-[12px] rounded-full text-white font-medium transition-colors",
            isFormValid ? "bg-blue hover:bg-blue-600" : "bg-gray-400"
          )}
          disabled={!isFormValid || isLoading}
          onClick={handleSubmitOrder}
        >
          {isLoading
            ? isProcessingPayment
              ? t("summary.redirecting")
              : t("summary.processing")
            : t("summary.buyNow")}
        </button>
      </div>
    </div>
  );

  // Desktop version
  const desktopVersion = (
    <div className="hidden md:block max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Main content */}
        <div className="lg:w-2/3">
          <Banner
            backgroundImage={game.image || "/banner.png"}
            height="250px"
          />

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-6 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-2xl font-medium text-gray-800 mb-2">
                {game.name}
              </h1>
              <p className="text-gray-600">{game.description}</p>
            </div>

            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                {t("block.selectAmount")}
              </h2>
              <CurrencySelector
                //@ts-ignore
                options={currencyOptions}
                currencyName={game.currencyName}
                currencyImage={game.currencyImage}
                onSelect={setSelectedAmount}
                selectedId={selectedAmount}
                enhanced={true}
              />
            </div>

            <div className="p-6 border-b border-gray-100">
              <UserIdForm
                requiresServer={game.requiresServer}
                userId={userId}
                serverId={serverId}
                agreeToTerms={agreeToTerms}
                onUserIdChange={setUserId}
                onServerIdChange={setServerId}
                onAgreeChange={setAgreeToTerms}
              />
            </div>

            <div className="p-6">
              <PaymentMethodSelector
                enhanced={true}
                onSelect={setSelectedPaymentMethod}
                selectedMethod={selectedPaymentMethod}
              />
            </div>

            {error && (
              <div className="px-6 pb-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Order summary */}
        <div className="lg:w-1/3">
          <OrderSummary
            game={game}
            selectedCurrency={selectedCurrency}
            isFormValid={isFormValid}
            userId={userId}
            serverId={serverId}
            onSubmit={handleSubmitOrder}
            isLoading={isLoading}
            //@ts-ignore
            isProcessingPayment={isProcessingPayment}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobileVersion}
      {desktopVersion}
    </>
  );
}
