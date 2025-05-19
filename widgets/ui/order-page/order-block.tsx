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
  const [userIdDB, setUserIdDB] = useState("");
  const [game, setGame] = useState<GameData | null>(null);
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const [showInfo, setShowInfo] = useState(initialExpandInfo);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("tbank");

  const { createOrder, isLoading, isProcessingPayment, error, setError } =
    useCreateOrder(selectedPaymentMethod === "tbank");

  useEffect(() => {
    const local_user = localStorage.getItem("userId");
    if (local_user) {
      setUserIdDB(local_user);
    }
    if (product) {
      let replenishmentArray = [];

      try {
        if (typeof product.replenishment === "string") {
          replenishmentArray = JSON.parse(product.replenishment);
        } else if (Array.isArray(product.replenishment)) {
          replenishmentArray = product.replenishment;
        }
      } catch (error) {
        replenishmentArray = [];
      }

      const currencyType =
        replenishmentArray.length > 0 ? replenishmentArray[0].type : "";
      const formattedCurrencyName =
        product.currency_name ||
        (currencyType
          ? currencyType.charAt(0).toUpperCase() + currencyType.slice(1)
          : product.type === "Bigo"
          ? "Diamonds"
          : "Coins");

      setGame({
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        currencyName: formattedCurrencyName,
        currencyImage:
          product.currency_image ||
          `/currency-${product.type.toLowerCase()}.png`,
        requiresServer: product.type === "Smile",
      });

      setCurrencyOptions(
        replenishmentArray.map((item: any, index: number) => ({
          id: index,
          amount: item.amount,
          price: `${item.price.toFixed(2)} ${product.currency_name || "RUB"}`,
          type: item.type,
          sku: item.sku,
        }))
      );
    }
  }, [product]);

  if (isProductLoading || !game) {
    return <OrderBlockSkeleton />;
  }

  const selectedCurrency =
    currencyOptions.find((c) => c.id === selectedAmount) || null;

  const isFormValid =
    selectedCurrency !== null &&
    userId.trim() !== "" &&
    agreeToTerms &&
    (!game.requiresServer || serverId.trim() !== "");

  const handleSubmitOrder = async () => {
    setError("");

    if (!isFormValid || !selectedCurrency) {
      setError(t("errors.invalidForm"));
      return;
    }

    const numericPrice = selectedCurrency.price.replace(/[^0-9.]/g, "");
    const formattedPrice = Number(numericPrice).toFixed(2);

    const orderData: CreateOrderDto = {
      game_id: game.id,
      user_id: userIdDB,
      currency_id: selectedCurrency.id,
      amount: selectedCurrency.amount,
      price: formattedPrice,
      payment_method: selectedPaymentMethod,
      user_game_id: userId,
      server_id: game.requiresServer ? serverId : undefined,
    };

    try {
      const response = (await createOrder(orderData)) as any; // предполагается, что createOrder возвращает промис

      console.log(response);

      if (selectedPaymentMethod === "tbank") {
        const params = new URLSearchParams({
          orderId: response.id,
          amount: selectedCurrency.amount.toString(),
          price: numericPrice,
          currencyName: game.currencyName,
          gameName: game.name,
          userId: userId,
          userIdDB: userIdDB,
          serverId: game.requiresServer ? serverId : "",
        });

        window.location.href = `/t-bank?${params.toString()}`;
      }

      if (selectedPaymentMethod === "nspk" && selectedCurrency) {
        const params = new URLSearchParams({
          orderId: Math.floor(Math.random() * 1000000).toString(),
          amount: selectedCurrency.amount.toString(),
          price: numericPrice,
          currencyName: game.currencyName,
          gameName: game.name,
          userId: userId,
          serverId: game.requiresServer ? serverId : "",
        });

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
      }
    } catch (err) {
      console.log(err);
      setError(t("errors.orderFailed"));
    }
  };

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
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2">
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
              : "Loading..."
            : t("summary.buyNow")}
        </button>
      </div>
    </div>
  );

  const desktopVersion = (
    <div className="hidden md:block max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
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
        <div className="lg:w-1/3">
          <OrderSummary
            game={game}
            selectedCurrency={selectedCurrency}
            isFormValid={isFormValid}
            userId={userId}
            serverId={serverId}
            onSubmit={handleSubmitOrder}
            isLoading={isLoading}
            // isProcessingPayment={isProcessingPayment}
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
