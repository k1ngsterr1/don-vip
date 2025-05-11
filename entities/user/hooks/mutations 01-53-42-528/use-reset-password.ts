// lib/hooks/user/use-reset-password.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/config/apiClient";

interface ResetPasswordDto {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * Hook to reset the user's password
 */
export function useResetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ResetPasswordDto) => {
      const response = await apiClient.post("/user/reset-password", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate user data after password reset
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
