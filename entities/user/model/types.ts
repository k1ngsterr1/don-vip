export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  gender: "male" | "female" | "other";
  birthDate?: string;
  phone?: string;
  email: string;
  socialProvider?: "vk" | "google" | null;
}
