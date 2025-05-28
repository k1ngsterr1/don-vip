"use client";
import { LoginForm } from "@/widgets/ui/forms/login-form/login-form";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const i18n = useTranslations("auth-login");

  return (
    <main className="md:min-h-[80vh] w-full flex items-center justify-center">
      <div className="px-4 py-6">
        <h1 className="text-[28px] font-unbounded text-center font-medium mb-6">
          {i18n("login.title")}
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
