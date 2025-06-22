import { PaymentSuccessWidget } from "@/widgets/ui/payment-page/success/success-payment";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <PaymentSuccessWidget orderNumber="ORD-12345678" amount="$99.99" />
    </div>
  );
}
