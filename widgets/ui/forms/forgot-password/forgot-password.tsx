"use client";

import type React from "react";

import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isFormFilled = email.trim() !== "" || phone.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email && !phone) {
      setError("Введите email или номер телефона");
      return;
    }

    // In a real app, this would call a password reset API
    setSuccessMessage("Письмо с инструкциями отправлено на указанный адрес");
    setError("");
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-6">
        Введите e-mail или номер телефона и мы отправим вам ссылку для сброса
        пароля
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          type="email"
          placeholder="mail@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-[#ff272c] text-xs">{error}</p>}
        {successMessage && (
          <p className="text-green-600 text-xs">{successMessage}</p>
        )}
        <Button
          type="submit"
          className={`w-full rounded-full text-white ${
            isFormFilled
              ? "bg-blue hover:bg-blue/90"
              : "bg-[#AAAAAB] hover:bg-[#AAAAAB]/90"
          }`}
          disabled={!isFormFilled}
        >
          Отправить
        </Button>
      </form>
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>
          Продолжая, вы соглашаетесь с{" "}
          <Link href="#" className="text-blue">
            условиями конфиденциальности
          </Link>
        </p>
      </div>
      <SocialAuth />
    </div>
  );
}
