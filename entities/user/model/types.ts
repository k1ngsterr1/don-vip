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
}
