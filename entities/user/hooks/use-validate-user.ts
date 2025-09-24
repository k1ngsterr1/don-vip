import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const DONATBANK_API_KEY =
  "827eba50a80de0f3b07025b6021e3b6e328eb8ad243ca803ccdd7be95d6f4828fa7e03a64d6065858378f6ff9fcdccad";
const DONATBANK_API_URL = "https://donatbank.com/api/v1/user/check-user";

// Маппинг игр с их Donatbank product ID
const DONATBANK_PRODUCT_MAP: Record<number, string> = {
  1: "e13a4483-3778-4b19-bc87-39d1771df949", // AFK Journey
  2: "5912294f-09b6-4419-8e48-4a56df09ed15", // Age of Empires Mobile
  3: "81297b4f-880a-40ab-aca4-4b6a9cf3fb2b", // Arena Breakout Mobile
  4: "59340c9c-9116-4029-91f8-63d07b584d12", // Bigo Live
  5: "5d72e623-67ab-4563-a8e6-5dc8ab13d3bd", // Blood Strike
  6: "f3a9fd8e-3323-4e27-84f9-1ccc1eb70ec2", // Delta Force
  7: "aca5077f-ea93-40ea-8955-5bc64693a2c5", // Dragonheir: Silent Gods
  8: "0a2a83a0-dee0-4f20-a142-1387db878099", // EA SPORTS FC Mobile
  9: "39245ed3-f1d4-4c5a-9821-d40aa1896bd4", // Farlight 84
  10: "2181d735-cef2-453e-9516-968b27369635", // Forsaken World 2
  11: "63d0ffb5-eadc-4a5c-a5e6-365f9b08d3df", // Free Fire
  12: "92b09e9d-a69b-4906-9ebc-2bad5c7840a0", // Genshin Impact
  13: "928e8327-7203-4621-b10a-03d2961c86e0", // Honkai: Star Rail
  14: "9d5713f9-e08c-4860-b4e8-5ed8b9233555", // Honor of Kings
  15: "75a72cd8-c3a6-4364-8b4a-9b1d6580bffb", // King of Avalon
  16: "d43168f4-4e29-4c80-a787-9247e65db0db", // League of Legends: Wild Rift
  17: "0fab825d-b171-42fb-846e-aacc3ead6802", // Likee
  18: "b55a7975-5217-4d61-babf-0951a6812033", // Love and Deepspace
  19: "6fbda5b1-9580-4222-96e4-801f9ed04fdb", // Magic Chess: Go Go
  20: "d57cf46a-366c-4829-969c-022edd5cbd2d", // Marvel Rivals
  21: "81ae5b22-893a-4686-9d7f-e4f5b984953b", // Mobile Legends: Bang Bang (Global)
  22: "881f9ab8-60ec-4e7f-8f36-b8d4f9559255", // Mobile Legends: Bang Bang (Indonesia)
  23: "8dcb327b-bd10-4caa-935e-dac9f772bfac", // Mobile Legends: Bang Bang (Malaysia)
  24: "2468c231-93ab-4c09-8d49-cdc780a45907", // Mobile Legends: Bang Bang (Other)
  25: "0ff24f50-5b82-4435-a8e4-f69516dd7824", // Mobile Legends: Bang Bang (PH/TH)
  26: "5740735d-04fe-4b18-bffa-252531b12843", // Mobile Legends: Bang Bang (Russia)
  27: "26e90b6d-ad56-494a-941b-437f890e16e6", // New State
  28: "155ef635-a7d5-4513-9f30-c891dcbfacaf", // PUBG Mobile
  29: "bca7ac01-003b-4d84-a773-dc79ea6e5422", // Ragnarok M: Classic
  30: "d98edfb3-4af0-469a-8c1f-e88dade3e4e4", // Soul Land: New World
  31: "7596cdde-4050-4293-9be9-4a61eaeb31e8", // Watcher of Realms
  32: "7a6632d4-19af-4bd6-89a9-9f9491d8ac94", // Zenless Zone Zero
  33: "0e66d5d7-1745-49ac-84c1-144249b843ff", // Zepeto
};

interface ValidateUserRequest {
  userId: string;
  gameId: number;
  zoneId?: string;
}

interface ValidateUserResponse {
  status: "success" | "failed" | "error";
  message: string;
  nickname?: string | null;
  validated: boolean;
}

export const useValidateUser = () => {
  return useMutation<ValidateUserResponse, Error, ValidateUserRequest>({
    mutationFn: async ({ userId, gameId, zoneId }) => {
      try {
        // Получаем product ID для игры
        const productId = DONATBANK_PRODUCT_MAP[gameId];
        if (!productId) {
          throw new Error("Game not supported for validation");
        }

        // Подготавливаем данные для запроса
        const requestBody: any = {
          userId: userId.toString(),
          productId,
        };

        // Добавляем zoneId если предоставлен
        if (zoneId) {
          requestBody.zoneId = zoneId.toString();
        }

        // Делаем прямой запрос к Donatbank API
        const response = await axios.post(DONATBANK_API_URL, requestBody, {
          headers: {
            "x-api-key": DONATBANK_API_KEY,
            "Content-Type": "application/json",
          },
        });

        const data = response.data;

        return {
          status: data.status === "success" ? "success" : "failed",
          message: data.message,
          nickname: data.nickname || null,
          validated: data.status === "success",
        };
      } catch (error: any) {
        // Обработка ошибок axios
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
