"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Gift, Users, TrendingUp } from "lucide-react";
import { Button } from "@/shared/ui/button/button";
import { useLocale } from "next-intl";
import { apiClient } from "@/shared/config/apiClient";

interface ReferralStats {
  referral_code: string;
  referral_discount: number;
  referrals_count: number;
  total_discount_earned: number;
  recent_referrals: Array<{
    user_name: string;
    discount_added: number;
    order_amount: number;
    created_at: string;
  }>;
}

export function ReferralSystem() {
  const locale = useLocale();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const texts = {
    title: locale === "ru" ? "Реферальная система" : "Referral System",
    description:
      locale === "ru"
        ? "Создайте свой реферальный код и делитесь им с друзьями. За каждого приглашенного друга, совершившего покупку, вы получите скидку 1% (максимум 20%)."
        : "Create your referral code and share it with friends. For each friend who makes a purchase, you get 1% discount (up to 20%).",
    generateCode:
      locale === "ru" ? "Создать реферальный код" : "Generate Referral Code",
    generating: locale === "ru" ? "Создание..." : "Generating...",
    generationError:
      locale === "ru" ? "Ошибка при создании кода" : "Error generating code",
    currentDiscount: locale === "ru" ? "Текущая скидка" : "Current Discount",
    totalReferrals: locale === "ru" ? "Приглашено друзей" : "Total Referrals",
    totalEarned: locale === "ru" ? "Всего заработано" : "Total Earned",
    yourCode: locale === "ru" ? "Ваш реферальный код" : "Your Referral Code",
    copy: locale === "ru" ? "Копировать" : "Copy",
    copied: locale === "ru" ? "Скопировано" : "Copied",
    shareDescription:
      locale === "ru"
        ? "Поделитесь этим кодом с друзьями. Когда они зарегистрируются и сделают первый заказ, вы получите скидку!"
        : "Share this code with friends. When they register and make their first order, you get a discount!",
    howItWorks: locale === "ru" ? "Как это работает" : "How it Works",
    step1:
      locale === "ru"
        ? "Поделитесь своим реферальным кодом с друзьями"
        : "Share your referral code with friends",
    step2:
      locale === "ru"
        ? "Друг регистрируется и использует ваш код при создании аккаунта"
        : "Friend registers and uses your code when creating account",
    step3:
      locale === "ru"
        ? "После первой покупки друга вы получаете скидку 1% на все последующие заказы (до 20%)"
        : "After friend's first purchase, you get 1% discount on all future orders (up to 20%)",
    recentEarnings:
      locale === "ru" ? "Последние начисления" : "Recent Earnings",
    orderAmount: locale === "ru" ? "Сумма заказа" : "Order Amount",
  };

  useEffect(() => {
    loadReferralStats();
  }, []);

  const loadReferralStats = async () => {
    try {
      const response = await apiClient.get("/user/referral/stats");
      setStats(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Пользователь ещё не создал реферальный код
        setStats(null);
      } else {
        console.error("Error loading referral stats:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async () => {
    setGenerating(true);
    try {
      const response = await apiClient.post("/user/referral/generate");
      await loadReferralStats();
    } catch (error) {
      console.error("Error generating referral code:", error);
      alert(texts.generationError);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (stats?.referral_code) {
      navigator.clipboard.writeText(stats.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <Gift className="w-16 h-16 mx-auto mb-4 text-blue" />
        <h3 className="text-xl font-semibold mb-2">{texts.title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {texts.description}
        </p>
        <Button
          onClick={generateReferralCode}
          disabled={generating}
          className="mx-auto"
        >
          {generating ? texts.generating : texts.generateCode}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{texts.currentDiscount}</p>
              <p className="text-3xl font-bold text-blue mt-1">
                {stats.referral_discount}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{texts.totalReferrals}</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {stats.referrals_count}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{texts.totalEarned}</p>
              <p className="text-3xl font-bold text-orange mt-1">
                {stats.total_discount_earned}%
              </p>
            </div>
            <Gift className="w-8 h-8 text-orange" />
          </div>
        </div>
      </div>

      {/* Реферальный код */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">{texts.yourCode}</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-lg font-semibold">
            {stats.referral_code}
          </div>
          <Button
            onClick={copyToClipboard}
            variant="secondary"
            className="flex items-center gap-2"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
            {copied ? texts.copied : texts.copy}
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-3">{texts.shareDescription}</p>
      </div>

      {/* Как работает */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">{texts.howItWorks}</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-semibold">
              1
            </div>
            <p className="text-gray-700">{texts.step1}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-semibold">
              2
            </div>
            <p className="text-gray-700">{texts.step2}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-semibold">
              3
            </div>
            <p className="text-gray-700">{texts.step3}</p>
          </div>
        </div>
      </div>

      {/* История начислений */}
      {stats.recent_referrals.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">{texts.recentEarnings}</h3>
          <div className="space-y-3">
            {stats.recent_referrals.map((referral, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{referral.user_name}</p>
                  <p className="text-sm text-gray-600">
                    {texts.orderAmount}: ₽{referral.order_amount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    +{referral.discount_added}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(referral.created_at).toLocaleDateString(locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
