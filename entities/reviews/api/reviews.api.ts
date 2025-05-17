import { apiClient, extractErrorMessage } from "@/shared/config/apiClient";

// Updated Types based on the backend DTOs
export interface CreateFeedbackDto {
  text: string;
  reaction: boolean; // Changed from sentiment to reaction (boolean)
  product_id: number; // Changed from gameId to product_id
  user_id: number;
}

export interface UpdateFeedbackDto {
  text?: string;
  reaction?: boolean; // Changed from sentiment to reaction
}

export interface FeedbackResponse {
  id: number;
  text: string;
  reaction: boolean; // Changed from sentiment to reaction
  userId: number;
  product_id?: number; // Changed from gameId to product_id
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedFeedbackResponse {
  data: FeedbackResponse[];
  total: number; // Matches the actual API response structure
  page: number;
  lastPage: number; // Changed from totalPages to lastPage
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

  // Accept feedback
  accept: async (id: number): Promise<FeedbackResponse> => {
    try {
      const response = await apiClient.patch(`/feedback/${id}/accept`);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // Decline feedback
  decline: async (id: number): Promise<FeedbackResponse> => {
    try {
      const response = await apiClient.patch(`/feedback/${id}/decline`);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // Get only accepted feedbacks
  getAccepted: async (
    page = 1,
    limit = 10
  ): Promise<PaginatedFeedbackResponse> => {
    try {
      const response = await apiClient.get(
        `/feedback/list/accepted?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
