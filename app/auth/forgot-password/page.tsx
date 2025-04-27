import { ForgotPasswordForm } from "@/widgets/ui/forms/forgot-password/forgot-password";

export default function ForgotPasswordPage() {
  return (
    <main>
      <div className="px-4 py-6">
        <h1 className="text-[28px] font-unbounded text-center font-medium mb-6">
          Забыли пароль?
        </h1>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
