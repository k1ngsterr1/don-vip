"use client";

import { RegisterForm } from "@/widgets/ui/forms/register-form/register-form";

export default function RegisterPage() {
  return (
    <main className="md:h-[80vh] flex items-center justify-center">
      <div className="px-4 py-6">
        <h1 className="text-[28px] font-unbounded text-center font-medium mb-6">
          Регистрация
        </h1>
        <RegisterForm />
      </div>
    </main>
  );
}
