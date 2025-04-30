"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";

import { AuthInput } from "@/shared/ui/auth-input/auth-input";
import { Button } from "@/shared/ui/button/button";
import { SocialAuth } from "@/shared/ui/social-input/social-input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const isFormFilled = email.trim() !== "" && password.trim() !== "";

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validation
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Введите email";
    } else if (!validateEmail(email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!password.trim()) {
      newErrors.password = "Введите пароль";
    } else if (password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would call an authentication API
      console.log(`Login attempt with: ${email}`);

      // Success handling
      alert(`Успешный вход: ${email}`);

      // Reset form after successful login
      // setEmail("")
      // setPassword("")
    } catch (error) {
      console.error("Login error:", error);
      alert("Ошибка при входе. Пожалуйста, попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md   mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <AuthInput
          type="email"
          placeholder="mail@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // Clear error when user types
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          error={errors.email}
          disabled={isLoading}
          aria-label="Email"
        />

        <div className="space-y-1">
          <AuthInput
            type="password"
            placeholder="Введите ваш пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              // Clear error when user types
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            showPasswordToggle
            error={errors.password}
            disabled={isLoading}
            aria-label="Пароль"
          />
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs md:text-sm text-blue hover:underline"
              aria-label="Забыли пароль"
            >
              Забыли пароль?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className={`w-full rounded-full text-white py-3 md:py-4 text-sm md:text-base ${
            isFormFilled && !isLoading
              ? "bg-blue hover:bg-blue/90"
              : "bg-[#AAAAAB] hover:bg-[#AAAAAB]/90"
          }`}
          disabled={!isFormFilled || isLoading}
          aria-label="Войти"
        >
          {isLoading ? "Вход..." : "Войти"}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs md:text-sm text-gray-500">
        <p>
          Продолжая, вы соглашаетесь с{" "}
          <Link href="#" className="text-black hover:underline">
            условиями конфиденциальности
          </Link>
        </p>
      </div>

      <SocialAuth />

      <div className="mt-8 text-center">
        <p className="text-sm md:text-base text-[#929294]">
          Нет аккаунта?{" "}
          <Link
            href="/auth/register"
            className="text-black font-medium hover:underline"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
