import { useMutation } from "@tanstack/react-query";
import { ResetPasswordWithTokenPayload, userApi } from "../../auth/user-api";

/**
 * Hook to reset password using a token from email link
 */
export function useResetPasswordWithToken() {
  return useMutation({
    mutationFn: (data: ResetPasswordWithTokenPayload) =>
      userApi.resetPasswordWithToken(data),
    onSuccess: (data) => {
      console.log("Password reset successful:", data);
    },
    onError: (error) => {
      console.error("Password reset failed:", error);
    },
  });
}
