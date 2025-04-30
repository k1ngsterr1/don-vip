"use client";

import { CurrencySelector } from "@/entities/currency/ui/currency-selector";
import { useGameData } from "@/entities/games/hooks/use-game-data";
import { PaymentMethodSelector } from "@/entities/payment/ui/payment-method-selector";
import { cn } from "@/shared/utils/cn";
import { useState } from "react";
import { Banner } from "./banner/banner";
import { OrderSummary } from "./order-summary/order-summary";
import { ProductInfo } from "./product-info/product-info";
import { UserIdForm } from "./user-id-form/user-id-form";

interface OrderBlockProps {
  gameSlug: string;
  initialExpandInfo?: boolean;
}

export function OrderBlock({
  gameSlug,
  initialExpandInfo = false,
}: OrderBlockProps) {
  const { game, currencyOptions } = useGameData(gameSlug);
  const [showInfo, setShowInfo] = useState(initialExpandInfo);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const isFormValid =
    selectedAmount !== null &&
    userId !== "" &&
    agreeToTerms &&
    (!game.requiresServer || serverId !== "");

  // Find the selected currency option to display in the summary
  const selectedCurrency = selectedAmount
    ? currencyOptions.find((option) => option.id === selectedAmount)
    : null;

  // Mobile version (unchanged)
  const mobileVersion = (
    <div className="md:hidden">
      <Banner backgroundImage="/banner.png" height="112px" />
      <ProductInfo
        isExpanded={showInfo}
        onToggle={() => setShowInfo(!showInfo)}
        description={game.description}
      />
      <CurrencySelector
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
      <PaymentMethodSelector />
      <div className="fixed bottom-16 right-[16px] px-4 py-2">
        <button
          className={cn(
            "w-[140px] py-3 px-[12px] rounded-full text-white font-medium",
            isFormValid ? "bg-blue" : "bg-gray-400"
          )}
          disabled={!isFormValid}
        >
          Купить сейчас
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
          <Banner backgroundImage="/banner.png" height="250px" />

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-6 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-2xl font-medium text-gray-800 mb-2">
                {game.name}
              </h1>
              <p className="text-gray-600">{game.description}</p>
            </div>

            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                1. Выберите сумму пополнения
              </h2>
              <CurrencySelector
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
              <PaymentMethodSelector enhanced={true} />
            </div>
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
