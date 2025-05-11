"use client";

import type React from "react";
import { useState } from "react";
import { FileText, Mail, Phone, User } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { applyPromocode } from "@/widgets/ui/t-bank-form/utils/payment-utils";
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

      if (!email && !phone) {
        alert(formT("errors.emailOrPhone"));
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        setIsLoading(false);

        // Redirect to success page
        router.push(
          `/payment-success?orderId=${orderId}&amount=${amount}&currencyName=${currencyName}`
        );
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      alert(formT("errors.paymentError"));
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
