//@ts-nocheck
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Mail, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { generateToken } from "@/widgets/ui/t-bank-form/utils/payment-utils";
import { PaymentHeaderInfo } from "@/widgets/ui/t-bank-form/ui/payment-header-info";
import { AmountInput } from "@/widgets/ui/t-bank-form/ui/amount-input";
import { FormInput } from "@/widgets/ui/t-bank-form/ui/form-input";
import { SubmitButton } from "@/widgets/ui/t-bank-form/ui/submit-button";
import { PaymentFooter } from "@/widgets/ui/t-bank-form/ui/payment-footer";
import { getUserId } from "@/shared/hooks/use-get-user-id";
import { PhoneInputWithCountry } from "@/shared/ui/phone-input/phone-input";

export default function TBankPaymentPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("tpayment");
  const formT = useTranslations("tpayment.form");
  const descriptionT = useTranslations("tpayment.form.description");

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount") || "0";
  const price = searchParams.get("price") || "0";
  const currencyName = searchParams.get("currencyName") || "coins";
  const gameName = searchParams.get("gameName") || "Game";
  const userId = searchParams.get("userId") || "";
  const userIdDB = searchParams.get("userIdDB") || "";
  const serverId = searchParams.get("serverId") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(price);
  const [systemUserId, setSystemUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setSystemUserId(id);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchUserId();
  }, []);

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

      const realUserId = await getUserId();

      const finalOrderId = `${orderId}_${realUserId || "unknown"}`;
      const amountInKopecks = Math.round(Number.parseFloat(price) * 100);

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
        UserId: userIdDB || undefined,
        OrderId: orderId || undefined,
        ServerId: serverId || undefined,
        Email: email || undefined,
        Phone: phone || undefined,
        Name: name || undefined,
      };

      const paymentPayload = {
        TerminalKey: "1731053917858", // ✅ Замените на ваш
        Amount: amountInKopecks,
        OrderId: finalOrderId,
        Description: description,
        CustomerKey: userId,
        DATA: dataObject,
        Receipt: receiptData,
        SuccessURL: "https://don-vip.com/payment/success",
        FailURL: "https://don-vip.com",
      };

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
        "Fq%F0Hs9KbCxZkix" // ✅ Ваш SecretKey
      );

      const finalPayload = {
        ...paymentPayload,
        Token: token,
      };

      const response = await fetch("https://securepay.tinkoff.ru/v2/Init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      const responseText = await response.text();

      const result = JSON.parse(responseText);

      if (!result.Success) {
        throw new Error(result.Message || t("errors.paymentInit"));
      }

      // Перенаправление на оплату
      if (result.PaymentURL) {
        window.location.href = result.PaymentURL;
      }
    } catch (err: any) {
      console.log("Payment initialization error:", err);
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
                  <span className="font-medium">{price} ₽</span>
                </div>

                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>{t("total")}</span>
                  <span>{price} ₽</span>
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
                <div className="grid grid-cols-1 w-full  gap-6">
                  <div className="md:col-span-2">
                    <AmountInput amount={paymentAmount} />
                  </div>
                  <FormInput
                    id="email"
                    label="E-mail"
                    type="email"
                    placeholder="example@mail.com"
                    Icon={Mail}
                    translationNamespace="email"
                  />
                  <div className="md:col-span-2">
                    <PhoneInputWithCountry
                      id="phone"
                      label="Phone"
                      mask="phone"
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
