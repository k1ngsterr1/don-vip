"use client";

import { CurrencySelector } from "@/entities/currency/ui/currency-selector";
import { PaymentMethodSelector } from "@/entities/payment/ui/payment-method-selector";
import { cn } from "@/shared/utils/cn";
import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
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
}

export function OrderBlock({
  gameSlug,
  initialExpandInfo = false,
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

          return {
            id: index,
            amount: item.amount,
            price: `${convertedPrice.toFixed(2)} ${currentCurrency.code}`,
            originalPriceRub: priceInRub, // Keep original RUB price for order
            type: item.type,
            sku: item.sku,
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

    // Use original RUB price for order processing
    const originalPrice = selectedCurrency.originalPriceRub;
    const discountAmount =
      couponInfo?.type === "percentage"
        ? (originalPrice * appliedDiscount) / 100
        : appliedDiscount;
    const finalPrice = Math.max(0, originalPrice - discountAmount);
    const formattedPrice = finalPrice.toFixed(2);

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
      {/* Show payment method selector only for RUB currency */}
      {currentCurrency.code === "RUB" && (
        <PaymentMethodSelector
          onSelect={setSelectedPaymentMethod}
          selectedMethod={selectedPaymentMethod}
          currentCurrency={currentCurrency.code}
        />
      )}
      {/* Information about Pagsmile checkout for non-RUB currencies */}
      {shouldUsePagsmileCheckout && (
        <div className="px-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center">
              <div className="text-blue-500 mr-2">💳</div>
              <div>
                <div className="font-medium mb-1">
                  {t("payment.international.title")}
                </div>
                <div className="text-xs">
                  {t("payment.international.description")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="px-4 mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 flex flex-col gap-2">
        <button
          className={cn(
            "w-[140px] py-3 px-[12px] rounded-full text-white font-medium transition-colors",
            isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
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
            {/* Information about Pagsmile checkout for non-RUB currencies */}
            {shouldUsePagsmileCheckout && (
              <div className="p-6 border-b border-gray-100">
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                  <div className="flex items-center">
                    <div className="text-blue-500 mr-2">💳</div>
                    <div>
                      <div className="font-medium mb-1">
                        {t("payment.international.title")}
                      </div>
                      <div className="text-xs">
                        {t("payment.international.description")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Show payment method selector only for RUB currency */}
            {currentCurrency.code === "RUB" && (
              <div className="p-6">
                <PaymentMethodSelector
                  enhanced={true}
                  onSelect={setSelectedPaymentMethod}
                  selectedMethod={selectedPaymentMethod}
                  currentCurrency={currentCurrency.code}
                />
              </div>
            )}
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
