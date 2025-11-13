export interface LoginDto {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterDto {
  email?: string;
  phone?: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordDto {
  email?: string;
  phone?: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: string;
  identifier?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  referral_discount?: string | number; // Реферальная скидка в процентах
  referral_code?: string; // Реферальный код пользователя
  used_referral_code?: string; // Использованный реферальный код
  referrals_count?: number; // Количество приглашенных пользователей
}
