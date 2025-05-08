import { apiClient, extractErrorMessage } from "@/shared/config/apiClient";

// Types based on the backend DTOs
export interface CreateFeedbackDto {
  text: string;
  sentiment: "positive" | "negative";
  userId?: number;
  gameId?: number;
}

export interface UpdateFeedbackDto {
  text?: string;
  sentiment?: "positive" | "negative";
}

export interface FeedbackResponse {
  id: number;
  text: string;
  sentiment: "positive" | "negative";
  userId: number;
  gameId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedFeedbackResponse {
  data: FeedbackResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Feedback service functions
export const feedbackService = {
  // Create new feedback
  create: async (data: CreateFeedbackDto): Promise<FeedbackResponse> => {
    try {
      const response = await apiClient.post("/feedback", data);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // Get all feedbacks with pagination
  getAll: async (page = 1, limit = 10): Promise<PaginatedFeedbackResponse> => {
    try {
      const response = await apiClient.get(
        `/feedback?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // Get feedback by ID
  getById: async (id: number): Promise<FeedbackResponse> => {
    try {
      const response = await apiClient.get(`/feedback/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // Update feedback
  update: async (
    id: number,
    data: UpdateFeedbackDto
  ): Promise<FeedbackResponse> => {
    try {
      const response = await apiClient.patch(`/feedback/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // Delete feedback
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/feedback/${id}`);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
