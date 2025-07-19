"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { paymentApi } from "@/entities/payment/api/payment.api";
import { Button } from "@/shared/ui/button/button";
import { FormField } from "@/shared/ui/form-field/form-field";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";

export default function DonatBankPage() {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("DonatBank");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError(t("errors.invalidAmount"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await paymentApi.createDonatBankBalance({
        amount: numericAmount,
      });

      // Redirect to the payment URL provided by the API
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        setError(t("errors.paymentUrlMissing"));
      }
    } catch (err) {
      console.error("DonatBank payment error:", err);
      setError(t("errors.paymentFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = sanitized.split(".");
    if (parts.length > 2) {
      return;
    }

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    setAmount(sanitized);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="p-2 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("title")}
            </h1>
            <p className="text-gray-600">{t("subtitle")}</p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-center mb-6">
            {t("paymentDetails")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <FormField
                label={t("amount")}
                name="amount"
                type="text"
                placeholder={t("amountPlaceholder")}
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleAmountChange(e.target.value)
                }
                error={error || undefined}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" fullWidth disabled={isLoading || !amount}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                t("continueToPayment")
              )}
            </Button>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">
            {t("securePayment")}
          </h3>
          <p className="text-sm text-blue-700">
            {t("securePaymentDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}
