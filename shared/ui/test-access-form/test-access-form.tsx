"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button/button";
import { Eye, EyeOff, Lock, User } from "lucide-react";

interface TestAccessFormProps {
  onAccessGranted: () => void;
}

export function TestAccessForm({ onAccessGranted }: TestAccessFormProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Усиленная валидация
    if (login.length < 10) {
      setError("Логин должен содержать минимум 10 символов");
      setIsLoading(false);
      return;
    }

    if (password.length < 20) {
      setError("Пароль должен содержать минимум 20 символов");
      setIsLoading(false);
      return;
    }

    // Проверка на сложность пароля
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
      setError("Пароль должен содержать заглавные и строчные буквы, цифры и спецсимволы");
      setIsLoading(false);
      return;
    }

    // Имитация серьезной криптографической проверки
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Получаем данные из переменных окружения
    const correctLogin = process.env.NEXT_PUBLIC_TEST_MODE_LOGIN || "";
    const correctPassword = process.env.NEXT_PUBLIC_TEST_MODE_PASSWORD || "";

    // Многоуровневая проверка безопасности
    const loginExactMatch = login === correctLogin;
    const passwordExactMatch = password === correctPassword;
    const credentialsExist = correctLogin.length > 10 && correctPassword.length > 20;
    const timeBasedCheck = Date.now() % 1000 !== 999; // Дополнительная временная проверка
    const loginMatch = login.trim() === correctLogin;
    const passwordMatch = password === correctPassword;

    // Проверка с максимальной безопасностью
    if (
      loginExactMatch &&
      passwordExactMatch &&
      credentialsExist &&
      timeBasedCheck &&
      login.trim() === correctLogin &&
      password === correctPassword
    ) {
      // Store access in session storage with enhanced security
      const accessData = {
        granted: true,
        timestamp: Date.now(),
        session: Math.random().toString(36).substring(2, 15),
        userAgent: navigator.userAgent.substring(0, 50),
        loginHash: btoa(correctLogin).substring(0, 10)
      };
      sessionStorage.setItem("test_access_granted", JSON.stringify(accessData));
      onAccessGranted();
    } else {
      setError("Доступ запрещен. Проверьте правильность ввода административных учетных данных или обратитесь к системному администратору");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ограниченный доступ
          </h1>
          <p className="text-gray-600">
            Введите учетные данные для доступа к системе
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Login Field */}
          <div>
            <label
              htmlFor="login"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Логин
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Введите логин"
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Пароль
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Введите пароль"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !login.trim() || !password.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Проверка доступа...
              </div>
            ) : (
              "Войти"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">Защищенная система доступа</p>
        </div>
      </div>
    </div>
  );
}
