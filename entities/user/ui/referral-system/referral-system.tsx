"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Gift, Users, TrendingUp } from "lucide-react";
import { Button } from "@/shared/ui/button/button";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("ReferralSystem");
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

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
      alert(t("generationError"));
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
        <h3 className="text-xl font-semibold mb-2">{t("title")}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {t("description")}
        </p>
        <Button
          onClick={generateReferralCode}
          disabled={generating}
          className="mx-auto"
        >
          {generating ? t("generating") : t("generateCode")}
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
              <p className="text-sm text-gray-600">{t("currentDiscount")}</p>
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
              <p className="text-sm text-gray-600">{t("totalReferrals")}</p>
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
              <p className="text-sm text-gray-600">{t("totalEarned")}</p>
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
        <h3 className="text-lg font-semibold mb-4">{t("yourCode")}</h3>
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
            {copied ? t("copied") : t("copy")}
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-3">{t("shareDescription")}</p>
      </div>

      {/* Как работает */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">{t("howItWorks")}</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-semibold">
              1
            </div>
            <p className="text-gray-700">{t("step1")}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-semibold">
              2
            </div>
            <p className="text-gray-700">{t("step2")}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-semibold">
              3
            </div>
            <p className="text-gray-700">{t("step3")}</p>
          </div>
        </div>
      </div>

      {/* История начислений */}
      {stats.recent_referrals.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">{t("recentEarnings")}</h3>
          <div className="space-y-3">
            {stats.recent_referrals.map((referral, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{referral.user_name}</p>
                  <p className="text-sm text-gray-600">
                    {t("orderAmount")}: ₽{referral.order_amount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    +{referral.discount_added}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(referral.created_at).toLocaleDateString("ru-RU")}
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
