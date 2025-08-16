import { apiClient, extractErrorMessage } from "@/shared/config/apiClient";

interface BigoErrorResponse {
  status: "error";
  error: {
    code: number;
    message: string;
  };
}

interface BigoSuccessResponse {
  status: "success";
  data: {
    username?: string;
    userInfo?: {
      vipStatus?: string;
    };
  };
}

type BigoApiResponse = BigoSuccessResponse | BigoErrorResponse;

interface ValidateBigoUserResponse {
  success: boolean;
  data?: {
    username?: string;
    userInfo?: {
      vipStatus?: string;
    };
  };
  error?: string;
  errorCode?: number;
}

export const bigoService = {
  /**
   * Validates a Bigo user ID
   * @param userId - The Bigo user ID to validate
   * @returns Promise with validation result
   */
  async validateUserId(userId: string): Promise<ValidateBigoUserResponse> {
    try {
      const response = await apiClient.post<BigoApiResponse>("/bigo/validate", {
        user_id: userId,
      });

      const data = response.data;

      // Check if the response indicates an error
      if (data.status === "error" && data.error) {
        return {
          success: false,
          error: data.error.message,
          errorCode: data.error.code,
        };
      }

      // If we got here, it's a success response
      return {
        success: true,
        data: (data as BigoSuccessResponse).data,
      };
    } catch (error: any) {
      // Handle axios errors or other exceptions
      if (error.response?.data?.status === "error") {
        // API returned an error response
        const errorData = error.response.data as BigoErrorResponse;
        return {
          success: false,
          error: errorData.error.message,
          errorCode: errorData.error.code,
        };
      }

      // Generic error handling
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
