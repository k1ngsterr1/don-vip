import { useMutation } from "@tanstack/react-query";
import {
  validateUser,
  ValidateUserRequest,
  ValidateUserResponse,
} from "../api/validate-user.api";

export const useValidateUser = () => {
  return useMutation<ValidateUserResponse, Error, ValidateUserRequest>({
    mutationFn: async ({ userId, gameId, zoneId }) => {
      try {
        // Вызываем наш бэкенд API вместо прямого обращения к Donatbank
        const data = await validateUser({
          userId,
          gameId,
          zoneId,
        });

        return data;
      } catch (error: any) {
        // Обработка ошибок
        if (error.response?.data) {
          return {
            status: "failed" as const,
            message: error.response.data.message || "Validation failed",
            nickname: null,
            validated: false,
          };
        }

        throw new Error(error.message || "Failed to validate user");
      }
    },
  });
};
