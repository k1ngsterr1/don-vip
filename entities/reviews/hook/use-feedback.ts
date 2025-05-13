"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { feedbackService } from "../api/reviews.api";
import type {
  FeedbackResponse,
  PaginatedFeedbackResponse,
} from "../api/reviews.api";
import { useAuthStore } from "@/entities/auth/store/auth.store";

// Internal DTO that matches the component's structure
interface FormFeedbackDto {
  text: string;
  sentiment: "positive" | "negative";
  gameId?: number;
}

// Query keys
export const feedbackKeys = {
  all: ["feedback"] as const,
  lists: () => [...feedbackKeys.all, "list"] as const,
  list: (filters: { page: number; limit: number }) =>
    [...feedbackKeys.lists(), filters] as const,
  details: () => [...feedbackKeys.all, "detail"] as const,
  detail: (id: number) => [...feedbackKeys.details(), id] as const,
};

// Get all feedbacks with pagination
export function useFeedbacks(page = 1, limit = 10) {
  return useQuery<PaginatedFeedbackResponse, Error>({
    queryKey: feedbackKeys.list({ page, limit }),
    queryFn: () => feedbackService.getAll(page, limit),
  });
}

// Get a single feedback by ID
export function useFeedback(id: number) {
  return useQuery<FeedbackResponse, Error>({
    queryKey: feedbackKeys.detail(id),
    queryFn: () => feedbackService.getById(id),
    enabled: !!id, // Only run if id is provided
  });
}

// Create a new feedback
export function useCreateFeedback(
  options: { onSuccess?: () => void; redirectPath?: string } = {}
) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((state) => state.user); // ✅ get current user

  return useMutation<FeedbackResponse, Error, FormFeedbackDto>({
    mutationFn: (formData: FormFeedbackDto) => {
      if (!user?.id) {
        throw new Error("User ID is missing — user may not be authenticated");
      }

      return feedbackService.create({
        text: formData.text,
        reaction: formData.sentiment === "positive",
        product_id: formData.gameId || 0,
        user_id: user.id as any, // ✅ pass user_id to backend
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });

      if (options.onSuccess) {
        options.onSuccess();
      }

      if (options.redirectPath) {
        router.push(options.redirectPath);
      }
    },
  });
}

// Update an existing feedback
export function useUpdateFeedback(id: number) {
  const queryClient = useQueryClient();

  return useMutation<FeedbackResponse, Error, Partial<FormFeedbackDto>>({
    mutationFn: (formData: Partial<FormFeedbackDto>) => {
      // Transform the form data to match the API's expected structure
      const apiData: any = {};

      if (formData.text !== undefined) {
        apiData.text = formData.text;
      }

      if (formData.sentiment !== undefined) {
        apiData.reaction = formData.sentiment === "positive";
      }

      return feedbackService.update(id, apiData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });

      // Update the cache with the new data
      queryClient.setQueryData(feedbackKeys.detail(id), data);
    },
  });
}

// Delete a feedback
export function useDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => feedbackService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
      queryClient.removeQueries({ queryKey: feedbackKeys.detail(id) });
    },
  });
}
