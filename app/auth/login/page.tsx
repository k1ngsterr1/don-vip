"use client";

import { LoginForm } from "@/widgets/ui/forms/login-form/login-form";

export default function LoginPage() {
  return (
    <main>
      <div className="px-4 py-6">
        <h1 className="text-[28px] font-unbounded text-center font-medium mb-6">
          Вход
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
