"use client";

import type React from "react";
import { useState } from "react";
import { Mail, Phone, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  applyPromocode,
  generateToken,
} from "@/widgets/ui/t-bank-form/utils/payment-utils";
import { PaymentHeaderInfo } from "@/widgets/ui/t-bank-form/ui/payment-header-info";
import { AmountInput } from "@/widgets/ui/t-bank-form/ui/amount-input";
import { PromocodeInput } from "@/widgets/ui/t-bank-form/ui/promocode-input";
import { FormInput } from "@/widgets/ui/t-bank-form/ui/form-input";
import { SubmitButton } from "@/widgets/ui/t-bank-form/ui/submit-button";
import { PaymentFooter } from "@/widgets/ui/t-bank-form/ui/payment-footer";

export default function TBankPaymentPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("tpayment");
  const formT = useTranslations("tpayment.form");
  const promocodeT = useTranslations("tpayment.form.promocode");
  const descriptionT = useTranslations("tpayment.form.description");

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount") || "0";
  const price = searchParams.get("price") || "0";
  const currencyName = searchParams.get("currencyName") || "coins";
  const gameName = searchParams.get("gameName") || "Game";
  const userId = searchParams.get("userId") || "";
  const serverId = searchParams.get("serverId") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(price);
  const [originalAmount, setOriginalAmount] = useState(price);

  const [promocode, setPromocode] = useState("");
  const [appliedPromocode, setAppliedPromocode] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const [promocodeError, setPromocodeError] = useState("");

  const handleApplyPromocode = () => {
    const result = applyPromocode(promocode, originalAmount, {
      empty: promocodeT("errors.empty"),
      invalid: promocodeT("errors.invalid"),
    });

    if (result.success && result.discount && result.amount) {
      setAppliedPromocode({
        code: promocode,
        discount: result.discount,
      });
      setPaymentAmount(result.amount);
      setPromocodeError("");
    } else {
      setPromocodeError(result.error || "Error applying promocode");
    }
  };

  const handleRemovePromocode = () => {
    setAppliedPromocode(null);
    setPromocode("");
    setPromocodeError("");
    setPaymentAmount(originalAmount);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = e.currentTarget;
      const formElements = form.elements as HTMLFormControlsCollection;

      const email = (formElements.namedItem("email") as HTMLInputElement).value;
      const phone = (formElements.namedItem("phone") as HTMLInputElement).value;
      const name =
        (formElements.namedItem("name") as HTMLInputElement)?.value || "";
      const description =
        (formElements.namedItem("description") as HTMLInputElement)?.value ||
        "Payment";

      if (!email && !phone) {
        alert(t("errors.emailOrPhone"));
        setIsLoading(false);
        return;
      }

      const finalOrderId = `order_${userId}_${Date.now()}`;
      const amountInKopecks = Math.round(
        Number.parseFloat(paymentAmount) * 100
      );

      const receiptData = {
        EmailCompany: "mail@mail.com",
        Taxation: "patent",
        FfdVersion: "1.2",
        Email: email || undefined,
        Phone: phone || undefined,
        Items: [
          {
            Name: description || "Оплата",
            Price: amountInKopecks,
            Quantity: 1,
            Amount: amountInKopecks,
            PaymentMethod: "full_prepayment",
            PaymentObject: "service",
            Tax: "none",
            MeasurementUnit: "pc",
          },
        ],
      };

      const dataObject = {
        UserId: userId || undefined,
        ServerId: serverId || undefined,
        Email: email || undefined,
        Phone: phone || undefined,
        Name: name || undefined,
      };

      const paymentPayload = {
        TerminalKey: "1731053917835DEMO", // ✅ Замените на ваш
        Amount: amountInKopecks,
        OrderId: finalOrderId,
        Description: description,
        CustomerKey: userId,
        DATA: dataObject,
        Receipt: receiptData,
        SuccessURL: "https://test.com/success",
        FailURL: "https://test.com/fail",
      };

      console.log("🚀 PaymentPayload (before token):", paymentPayload);

      // Генерация токена без Receipt и DATA
      const token = await generateToken(
        {
          TerminalKey: paymentPayload.TerminalKey,
          Amount: paymentPayload.Amount,
          OrderId: paymentPayload.OrderId,
          Description: paymentPayload.Description,
          CustomerKey: paymentPayload.CustomerKey,
          SuccessURL: paymentPayload.SuccessURL,
          FailURL: paymentPayload.FailURL,
        },
        "M3u78sPoxlVxe5fj" // ✅ Ваш SecretKey
      );

      const finalPayload = {
        ...paymentPayload,
        Token: token,
      };

      console.log("📤 Sending Init Request to Tinkoff:", finalPayload);

      const response = await fetch("https://securepay.tinkoff.ru/v2/Init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      const responseText = await response.text();
      console.log("📦 Raw Tinkoff Response:", responseText);

      const result = JSON.parse(responseText);

      if (!result.Success) {
        throw new Error(result.Message || t("errors.paymentInit"));
      }

      console.log("✅ Parsed Tinkoff Response:", result);

      // Опционально: отправка orderId в backend
      await fetch("/api/tinkoff/save-order", {
        method: "POST",
        body: JSON.stringify({ orderId: finalOrderId, userId }),
      });

      // Перенаправление на оплату
      if (result.PaymentURL) {
        window.location.href = result.PaymentURL;
      }
    } catch (err: any) {
      console.error("❌ Payment error:", err);
      alert(t("errors.paymentInit") || "Ошибка инициализации платежа.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border border-[#6798de]/20 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("orderSummary")}
              </h2>
              <PaymentHeaderInfo
                gameName={gameName}
                amount={amount}
                currencyName={currencyName}
                userId={userId}
                serverId={serverId}
              />

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("subtotal")}</span>
                  <span className="font-medium">{originalAmount} ₽</span>
                </div>

                {appliedPromocode && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("discount")}</span>
                    <span>
                      -
                      {(
                        Number.parseFloat(originalAmount) -
                        Number.parseFloat(paymentAmount)
                      ).toFixed(2)}{" "}
                      ₽
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>{t("total")}</span>
                  <span>{paymentAmount} ₽</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg border border-[#6798de]/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <h1 className="text-2xl font-bold text-white">
                  {t("paymentDetails")}
                </h1>
              </div>
              <form
                id="payform-tbank"
                onSubmit={handleSubmit}
                className="p-8 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <AmountInput amount={paymentAmount} />
                  </div>
                  <div className="md:col-span-2">
                    <PromocodeInput
                      promocode={promocode}
                      setPromocode={setPromocode}
                      appliedPromocode={appliedPromocode}
                      promocodeError={promocodeError}
                      onApply={handleApplyPromocode}
                      onRemove={handleRemovePromocode}
                    />
                  </div>
                  <FormInput
                    id="name"
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    Icon={User}
                    translationNamespace="name"
                  />
                  <FormInput
                    id="email"
                    label="E-mail"
                    type="email"
                    placeholder="example@mail.com"
                    Icon={Mail}
                    translationNamespace="email"
                  />

                  <div className="md:col-span-2">
                    <FormInput
                      id="phone"
                      label="Phone"
                      type="tel"
                      placeholder="+1 (123) 456-7890"
                      Icon={Phone}
                      translationNamespace="phone"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <SubmitButton
                      isLoading={isLoading}
                      amount={paymentAmount}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-500 text-center mt-6">
                  {formT("terms")}
                </div>
              </form>
            </div>
          </div>
        </div>
        <PaymentFooter />
      </main>
    </div>
  );
}
