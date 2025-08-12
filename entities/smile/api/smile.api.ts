import { apiClient, extractErrorMessage } from "@/shared/config/apiClient";

interface SmileSuccessResponse {
  status: "success";
  data: {
    nickname: string;
    avatar: string;
  };
}

interface SmileErrorResponse {
  status: "error";
  error: {
    code: number;
    message: string;
  };
}

type SmileApiResponse = SmileSuccessResponse | SmileErrorResponse;

interface ValidateSmileUserResponse {
  success: boolean;
  data?: {
    nickname: string;
    avatar: string;
  };
  error?: string;
  errorCode?: number;
}

export const smileService = {
  async validateUserId(
    userId: string,
    serverId: string,
    apiGame: string
  ): Promise<ValidateSmileUserResponse> {
    try {
      const response = await apiClient.post<SmileApiResponse>(
        "/product/bigo/validate",
        {
          apiGame: apiGame,
          user_id: userId,
          server_id: serverId,
        }
      );

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
        data: (data as SmileSuccessResponse).data,
      };
    } catch (error: any) {
      // Handle axios errors or other exceptions
      if (error.response?.data?.status === "error") {
        // API returned an error response
        const errorData = error.response.data as SmileErrorResponse;
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
