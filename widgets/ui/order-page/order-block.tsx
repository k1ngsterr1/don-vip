"use client";

import { CurrencySelector } from "@/entities/currency/ui/currency-selector";
import { useGameData } from "@/entities/games/hooks/use-game-data";
import { PaymentMethodSelector } from "@/entities/payment/ui/payment-method-selector";
import { cn } from "@/shared/utils/cn";
import { useState } from "react";
import { Banner } from "./banner/banner";
import { ProductInfo } from "./product-info/product-info";
import { UserIdForm } from "./user-id-form/user-id-form";

interface OrderPageProps {
  gameSlug: string;
  initialExpandInfo?: boolean;
}

export function OrderBlock({
  gameSlug,
  initialExpandInfo = false,
}: OrderPageProps) {
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

  return (
    <div className="">
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
      <div className="fixed bottom-16  right-[16px] px-4 py-2 ">
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
}
