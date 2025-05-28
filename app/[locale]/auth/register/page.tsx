"use client";
import { RegisterForm } from "@/widgets/ui/forms/register-form/register-form";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const i18n = useTranslations("register_auth");

  return (
    <main className="md:min-h-[80vh] flex items-center justify-center">
      <div className="px-4 py-6">
        <h1 className="text-[28px] font-unbounded text-center font-medium mb-6">
          {i18n("register.title")}
        </h1>
        <RegisterForm />
      </div>
    </main>
  );
}
