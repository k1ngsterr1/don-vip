"use client";

import { CurrencySelector } from "@/entities/currency/ui/currency-selector";
import { PaymentMethodSelector } from "@/entities/payment/ui/payment-method-selector";
import { cn } from "@/shared/utils/cn";
import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Banner } from "./banner/banner";
import { OrderSummary } from "./order-summary/order-summary";
import { ProductInfo } from "./product-info/product-info";
import { UserIdForm } from "./user-id-form/user-id-form";
import { useCreateOrder } from "@/entities/order/hooks/use-create-order";
import type { CreateOrderDto } from "@/entities/order/model/types";
import { useProduct } from "@/entities/product/hooks/queries/use-product";
import { OrderBlockSkeleton } from "./loading/skeleton-loading";
import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useGetMe } from "@/entities/auth/hooks/use-auth";
import { GuestAuthPopup } from "@/entities/order/ui/guest-user-popup";
import { useCurrency } from "@/entities/currency/hooks/use-currency";
import { DiamondPackages } from "./diamond-packages/diamond-packages";
import { ReviewsSection } from "./reviews-section/reviews-section";
import { FAQSection } from "./faq-section/faq-section";
import {
  InstructionTabs,
  InstructionContent,
} from "./instruction-section/instruction-section";
import { GameDescription } from "./game-description/game-description";
import { GameInfoBlock } from "./game-info-block/game-info-block";
import { PromoBlock } from "./promo-block/promo-block";
import { InfoBlock } from "./info-block/info-block";

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
  originalPriceRub: number;
  type: string;
  sku: string;
  discount?: number;
  isPopular?: boolean;
}

export function OrderBlock({
  gameSlug,
  initialExpandInfo = false, // Used to initialize showInfo state
}: OrderBlockProps) {
  const t = useTranslations("orderBlock");
  const { data: product, isLoading: isProductLoading } = useProduct(gameSlug);
  const { selectedCurrency: currentCurrency } = useCurrency();
  const [userIdDB, setUserIdDB] = useState("");
  const [game, setGame] = useState<GameData | null>(null);
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const [showInfo, setShowInfo] = useState(initialExpandInfo);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("tbank");
  const [showGuestAuthPopup, setShowGuestAuthPopup] = useState(false);
  const [guestIdentifier, setGuestIdentifier] = useState("");
  const [isUserIdValid, setIsUserIdValid] = useState(true); // Добавляем состояние для валидности User ID
  const [activeTab, setActiveTab] = useState<
    "instruction" | "reviews" | "description" | "faq"
  >("instruction");

  const handleValidationChange = (isValid: boolean) => {
    console.log("Validation changed:", isValid); // Для отладки
    setIsUserIdValid(isValid);
  };
  useEffect(() => {
    if (currentCurrency.code !== "RUB") {
      // For non-RUB currencies, use a generic payment method for Pagsmile checkout
      setSelectedPaymentMethod("pagsmile_checkout");
    } else if (selectedPaymentMethod === "pagsmile_checkout") {
      // If switching back to RUB, reset to default RUB method
      setSelectedPaymentMethod("tbank");
    }
  }, [currentCurrency.code]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponInfo, setCouponInfo] = useState<any>(null);

  // Flag to prevent popup from showing twice
  const identifierCollected = useRef(false);

  const {
    createOrder,
    isLoading,
    isProcessingPayment,
    error,
    setError,
    isGuestUser,
    needsIdentifier,
    shouldUsePagsmileCheckout,
  } = useCreateOrder(selectedPaymentMethod, currentCurrency.code);
  const locale = useLocale();

  const { user: authUser, isGuestAuth } = useAuthStore();
  const { data: me } = useGetMe();

  useEffect(() => {
    const local_user = localStorage.getItem("userId");
    if (local_user && local_user.trim() !== "") {
      setUserIdDB(local_user.trim());
    } else {
      setUserIdDB(""); // или вообще не устанавливай, если ты обрабатываешь undefined/null
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
        description:
          locale === "ru" ? product.description : product.description_en,
        image: product.image,
        currencyName: formattedCurrencyName,
        currencyImage:
          product.currency_image ||
          `/currency-${product.type.toLowerCase()}.png`,
        requiresServer:
          product.type === "Smile" && product.smile_api_game !== "pubgmobile",
      });

      setCurrencyOptions(
        replenishmentArray.map((item: any, index: number) => {
          // Convert price from RUB to selected currency
          const priceInRub = item.price;
          const convertedPrice =
            currentCurrency.code === "RUB"
              ? priceInRub
              : priceInRub * currentCurrency.rate; // Multiply by rate (how many foreign currency units per 1 RUB)

          // Add sample discount and popularity for demo
          const isPopular = index === 0; // First item is popular
          const discount =
            index === 0 ? 21 : index === 1 ? 20 : index === 2 ? 11 : 0;

          return {
            id: index,
            amount: item.amount,
            price: `${convertedPrice.toFixed(2)} ${currentCurrency.code}`,
            originalPriceRub: priceInRub, // Keep original RUB price for order
            type: item.type,
            sku: item.sku,
            discount,
            isPopular,
          };
        })
      );
    }
  }, [product, currentCurrency]);

  if (isProductLoading || !game) {
    return <OrderBlockSkeleton />;
  }

  const selectedCurrency =
    currencyOptions.find((c) => c.id === selectedAmount) || null;

  const isFormValid =
    selectedCurrency !== null &&
    userId.trim() !== "" &&
    (!game.requiresServer || serverId.trim() !== "") &&
    isUserIdValid; // Добавляем проверку валидности User ID

  // Get user identifier from various sources
  const getUserIdentifier = (): string | null => {
    if (authUser?.identifier) return authUser.identifier;
    if (me?.identifier) return me.identifier;
    if (authUser?.email) return authUser.email;
    if (me?.email) return me.email;
    return guestIdentifier || null;
  };

  const handleCouponApplied = (discount: number, couponData: any) => {
    setAppliedDiscount(discount);
    setCouponInfo(couponData);
  };

  const submitOrderWithIdentifier = (identifier: string) => {
    if (!isFormValid || !selectedCurrency) {
      setError("Please fill in all required fields");
      return;
    }

    // Calculate prices for both RUB and converted currency
    const originalPriceRub = selectedCurrency.originalPriceRub;
    const originalPriceConverted =
      currentCurrency.code === "RUB"
        ? originalPriceRub
        : originalPriceRub * currentCurrency.rate;

    // Calculate discount in RUB
    const discountAmountRub =
      couponInfo?.type === "percentage"
        ? (originalPriceRub * appliedDiscount) / 100
        : appliedDiscount;

    // Calculate final prices
    const finalPriceRub = Math.max(0, originalPriceRub - discountAmountRub);
    const finalPriceConverted =
      currentCurrency.code === "RUB"
        ? finalPriceRub
        : finalPriceRub * currentCurrency.rate;

    // Use converted price for the order (what the user actually pays)
    const formattedPrice = finalPriceConverted.toFixed(2);

    const orderData: CreateOrderDto = {
      identifier: identifier,
      game_id: game.id,
      user_id: userIdDB,
      currency_id: selectedCurrency.id,
      amount: selectedCurrency.amount,
      price: formattedPrice,
      payment_method: selectedPaymentMethod,
      user_game_id: !userId || userId.trim() === "" ? "unknown" : userId,
      server_id: game.requiresServer ? serverId : undefined,
      coupon_code: couponInfo?.code || undefined,
    };

    createOrder(orderData)
      .then((response: any) => {
        if (
          selectedPaymentMethod === "tbank" &&
          currentCurrency.code === "RUB"
        ) {
          const params = new URLSearchParams({
            orderId: response.id,
            amount: selectedCurrency.amount.toString(),
            price: formattedPrice, // Changed from numericPrice to formattedPrice (discounted price)
            currencyName: game.currencyName,
            gameName: game.name,
            userId: userId,
            userIdDB: userIdDB,
            serverId: game.requiresServer ? serverId : "",
          });

          window.location.href = `/t-bank?${params.toString()}`;
        } else {
          // Handle other payment methods here
          console.log(
            "Order created successfully for non-RUB currency:",
            response
          );
          // You can redirect to a different payment processor or show success message
        }
      })
      .catch((err) => {
        console.error("❌ Order creation failed:", err);
        setError("Failed to create order. Please try again.");
      });
  };

  const handleSubmitOrder = async () => {
    setError("");

    if (!isFormValid || !selectedCurrency) {
      setError("Please fill in all required fields");
      return;
    }

    // Get user identifier from various sources
    const userIdentifier = getUserIdentifier();

    // Force popup for testing - remove this condition later
    const shouldShowPopup =
      !userIdentifier && !guestIdentifier && !identifierCollected.current;

    if (shouldShowPopup) {
      setShowGuestAuthPopup(true);
      return;
    }

    // Use available identifier
    const finalIdentifier = userIdentifier || guestIdentifier;

    if (!finalIdentifier) {
      setError("Email or phone number is required");
      return;
    }

    submitOrderWithIdentifier(finalIdentifier);
  };

  const handleGuestAuthSubmit = (identifier: string) => {
    setGuestIdentifier(identifier);
    setShowGuestAuthPopup(false);
    identifierCollected.current = true;

    // Submit the order with the collected identifier
    submitOrderWithIdentifier(identifier);
  };

  const mobileVersion = (
    <div className="md:hidden min-h-screen bg-white">
      <Banner backgroundImage={game.image || "/banner.png"} height="112px" />
      <ProductInfo
        isExpanded={showInfo}
        onToggle={() => setShowInfo(!showInfo)}
        description={game.description}
      />
      {/* Game Info Block */}
      <GameInfoBlock gameName={game.name} />
      <PromoBlock onLoginClick={() => console.log("Login clicked")} />
      {/* Diamond Packages for mobile only */}
      <div className="block md:hidden">
        <DiamondPackages
          packages={currencyOptions}
          onSelect={setSelectedAmount}
          selectedId={selectedAmount}
          currencyName={game.currencyName}
          currencyImage={game.currencyImage}
        />
      </div>
      <UserIdForm
        apiGame={product?.smile_api_game}
        productType={product?.type}
        requiresServer={game.requiresServer}
        userId={userId}
        serverId={serverId}
        onUserIdChange={setUserId}
        onServerIdChange={setServerId}
        onValidationChange={handleValidationChange}
      />

      {/* Info Block with Features */}
      <InfoBlock />

      {/* Payment Method Selector */}
      <div className="px-4 py-6">
        <h3 className="text-base font-medium text-gray-800 mb-3">
          3 ВЫБЕРИТЕ СПОСОБ ОПЛАТЫ
        </h3>
        <PaymentMethodSelector
          onSelect={setSelectedPaymentMethod}
          selectedMethod={selectedPaymentMethod}
          currentCurrency={currentCurrency.code}
        />
      </div>

      {/* Instruction Tabs */}
      <InstructionTabs onTabChange={setActiveTab} defaultTab={activeTab} />

      {/* Tab Content */}
      {activeTab === "instruction" && (
        <InstructionContent gameName={game.name} />
      )}
      {activeTab === "description" && (
        <GameDescription gameName={game.name} description={game.description} />
      )}
      {activeTab === "faq" && <FAQSection />}
      {activeTab === "reviews" && <ReviewsSection />}
      {error && (
        <div className="px-4 mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Fixed Buy Button */}
      <div className="fixed bottom-16 right-4 z-10">
        <button
          className={cn(
            "w-[120px] py-3 px-3 rounded-full text-white font-medium transition-colors shadow-lg",
            isFormValid ? "bg-[#aaaaab] hover:bg-gray-600" : "bg-gray-400"
          )}
          disabled={!isFormValid || isLoading}
          onClick={handleSubmitOrder}
        >
          {isLoading
            ? isProcessingPayment
              ? t("summary.redirecting")
              : "Loading..."
            : "Купить сейчас"}
        </button>
      </div>

      {/* Add padding bottom to account for bottom menu */}
      <div className="h-20" />
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
              <p className="text-gray-600">{game.description}</p>{" "}
              {/* Language & Currency Button */}
              <div className="mt-4">
                <Link href="/language-currency" className="inline-block">
                  <button className="py-2 px-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-gray-700 font-medium transition-colors flex items-center gap-2">
                    <span>🌍</span>
                    <span>
                      {locale === "ru"
                        ? "Язык и валюта"
                        : "Language & Currency"}
                    </span>
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                {t("block.selectAmount")}
              </h2>

              {/* Diamond Packages for desktop */}
              <DiamondPackages
                packages={currencyOptions}
                onSelect={setSelectedAmount}
                selectedId={selectedAmount}
                currencyName={game.currencyName}
                currencyImage={game.currencyImage}
              />
            </div>

            <div className="p-6 border-b border-gray-100">
              <UserIdForm
                apiGame={product?.smile_api_game}
                productType={product?.type}
                requiresServer={game.requiresServer}
                userId={userId}
                serverId={serverId}
                // agreeToTerms={agreeToTerms} // removed
                onUserIdChange={setUserId}
                onServerIdChange={setServerId}
                onValidationChange={handleValidationChange}
                // onAgreeChange={setAgreeToTerms} // removed
              />
            </div>
            {/* PaymentMethodSelector is now shown for all currencies in enhanced mode */}
            <div className="p-6">
              <PaymentMethodSelector
                enhanced={true}
                onSelect={setSelectedPaymentMethod}
                selectedMethod={selectedPaymentMethod}
                currentCurrency={currentCurrency.code}
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

          {/* Additional components for desktop */}
          <div className="mt-6 space-y-6">
            {/* Game Info Block */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <GameInfoBlock gameName={game.name} />
            </div>

            {/* Info Block */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <InfoBlock />
            </div>

            {/* Promo Block */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <PromoBlock />
            </div>

            {/* Instruction Tabs and Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <InstructionTabs
                onTabChange={setActiveTab}
                defaultTab={activeTab}
              />
              {activeTab === "instruction" && (
                <InstructionContent gameName={game.name} />
              )}
              {activeTab === "description" && (
                <GameDescription
                  gameName={game.name}
                  description={game.description}
                />
              )}
              {activeTab === "faq" && <FAQSection />}
              {activeTab === "reviews" && <ReviewsSection />}
            </div>
          </div>
        </div>
        <div className="lg:w-1/3">
          <OrderSummary
            game={game}
            selectedCurrency={selectedCurrency}
            appliedDiscount={appliedDiscount}
            couponInfo={couponInfo}
            isFormValid={isFormValid}
            userId={userId}
            serverId={serverId}
            onSubmit={handleSubmitOrder}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobileVersion}
      {desktopVersion}
      <GuestAuthPopup
        isOpen={showGuestAuthPopup}
        onClose={() => {
          setShowGuestAuthPopup(false);
        }}
        onSubmit={handleGuestAuthSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
