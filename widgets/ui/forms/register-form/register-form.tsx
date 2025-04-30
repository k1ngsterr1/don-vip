"use client";

import type React from "react";

import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";
import Link from "next/link";
import { useState } from "react";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const isFormFilled = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    if (!email) newErrors.email = "Введите email";
    if (!password) newErrors.password = "Введите пароль";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Пароли не совпадают";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert(`Registration attempt with: ${email}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          type="email"
          placeholder="mail@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <AuthInput
          type="password"
          placeholder="Введите ваш пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPasswordToggle
          error={errors.password}
        />
        <Button
          type="submit"
          className={`w-full rounded-full text-white ${
            isFormFilled
              ? "bg-blue hover:bg-blue/90"
              : "bg-[#AAAAAB] hover:bg-[#AAAAAB]/90"
          }`}
          disabled={!isFormFilled}
        >
          Зарегистрироваться
        </Button>
        <div className="w-full flex items-end justify-between">
          <Link
            className="text-[13px] w-full text-right text-black"
            href="/auth/forgot-password"
          >
            Забыли пароль?
          </Link>
        </div>
      </form>
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>
          Продолжая, вы соглашаетесь с{" "}
          <Link href="#" className="text-black">
            условиями конфиденциальности
          </Link>
        </p>
      </div>
      <SocialAuth />

      <div className="mt-8 text-center">
        <p className="text-sm">
          Уже есть аккаунт?{" "}
          <Link href="/auth/login" className="text-blue font-medium">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
