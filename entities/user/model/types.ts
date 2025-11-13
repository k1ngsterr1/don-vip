export interface User {
  is_verified: boolean;
  identifier: string;
  id: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  gender: "male" | "female" | "other";
  birthDate?: string;
  phone?: string;
  email: string;
  socialProvider?: "vk" | "google" | null;
  referral_discount?: string | number; // Реферальная скидка в процентах
  referral_code?: string; // Реферальный код пользователя
  used_referral_code?: string; // Использованный реферальный код
  referrals_count?: number; // Количество приглашенных пользователей
}
