import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { RegisterDto } from "@/services/auth/auth.types";
import { useAuthStore } from "@/store/auth.store";

export const useRegister = () => {
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: (userData: RegisterDto) => authService.register(userData),
    onSuccess: (data) => {
      // Store tokens in localStorage
      localStorage.setItem("auth_tokens", JSON.stringify(data));
      // Update auth state
      setTokens(data);
    },
  });
};
