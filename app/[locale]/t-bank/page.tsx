"use client";

import type React from "react";
import { useState } from "react";
import { FileText, Mail, Phone, User } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const t = useTranslations("Payment.payment");
  const formT = useTranslations("Payment.payment.form");
  const promocodeT = useTranslations("Payment.payment.form.promocode");
  const descriptionT = useTranslations("Payment.payment.form.description");

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
        alert("Укажите email или телефон");
        setIsLoading(false);
        return;
      }

      const finalOrderId = `order_${userId}_${Date.now()}`;
      const amountInKopecks = Math.round(parseFloat(paymentAmount) * 100);

      const payload = {
        TerminalKey: "1731053917835DEMO",
        Amount: amountInKopecks,
        OrderId: finalOrderId,
        Description: description,
        CustomerKey: userId,
        SuccessURL: "https://test.com",
        FailURL: "https://test.com",
        DATA: {
          Email: email,
          Phone: phone,
          Name: name,
        },
        Receipt: {
          EmailCompany: "mail@mail.com",
          Taxation: "patent",
          FfdVersion: "1.2",
          Email: email,
          Phone: phone,
          Items: [
            {
              Name: description,
              Price: amountInKopecks,
              Quantity: 1,
              Amount: amountInKopecks,
              PaymentMethod: "full_prepayment",
              PaymentObject: "service",
              Tax: "none",
              MeasurementUnit: "pc",
            },
          ],
        },
      };

      const token = await generateToken(
        {
          TerminalKey: payload.TerminalKey,
          Amount: payload.Amount,
          OrderId: payload.OrderId,
        },
        "M3u78sPoxlVxe5fj"
      );

      const finalPayload = { ...payload, Token: token };

      const response = await fetch("https://securepay.tinkoff.ru/v2/Init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      const rawText = await response.text();
      console.log("📦 Raw Tinkoff Response:", rawText);

      if (!response.ok || response.status === 204) {
        throw new Error(`Ошибка инициализации платежа: ${response.status}`);
      }

      const result = JSON.parse(rawText);
      console.log("✅ Parsed Response:", result);

      if (result.Success && result.PaymentURL) {
        window.location.href = result.PaymentURL;
      } else {
        throw new Error(result.Message || "Ошибка инициализации платежа");
      }
    } catch (err) {
      console.error("❌ Ошибка платежа:", err);
      alert("Ошибка при инициализации платежа. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-md mx-auto px-4 py-8 md:py-12">
        <div className="bg-white pt-8 rounded-lg shadow-lg border border-[#6798de]/20 overflow-hidden">
          <PaymentHeaderInfo
            gameName={gameName}
            amount={amount}
            currencyName={currencyName}
            userId={userId}
            serverId={serverId}
          />
          <form
            id="payform-tbank"
            onSubmit={handleSubmit}
            className="p-6 space-y-4"
          >
            <AmountInput amount={paymentAmount} />
            <PromocodeInput
              promocode={promocode}
              setPromocode={setPromocode}
              appliedPromocode={appliedPromocode}
              promocodeError={promocodeError}
              onApply={handleApplyPromocode}
              onRemove={handleRemovePromocode}
            />
            <FormInput
              id="description"
              label="Description"
              type="text"
              placeholder="Payment description"
              Icon={FileText}
              translationNamespace="description"
            />
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
            <FormInput
              id="phone"
              label="Phone"
              type="tel"
              placeholder="+1 (123) 456-7890"
              Icon={Phone}
              translationNamespace="phone"
            />
            <SubmitButton isLoading={isLoading} amount={paymentAmount} />
            <div className="text-xs text-gray-500 text-center mt-4">
              {formT("terms")}
            </div>
          </form>
        </div>
        <PaymentFooter />
      </main>
    </div>
  );
}
