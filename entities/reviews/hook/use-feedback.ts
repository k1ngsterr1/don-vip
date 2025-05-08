"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateFeedbackDto,
  type FeedbackResponse,
  type PaginatedFeedbackResponse,
  feedbackService,
} from "../api/reviews.api";
import { useRouter } from "next/navigation";

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

  return useMutation<FeedbackResponse, Error, CreateFeedbackDto>({
    mutationFn: (data: CreateFeedbackDto) => feedbackService.create(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });

      // Call onSuccess callback if provided
      if (options.onSuccess) {
        options.onSuccess();
      }

      // Redirect if path provided
      if (options.redirectPath) {
        router.push(options.redirectPath);
      }
    },
  });
}

// Update an existing feedback
export function useUpdateFeedback(id: number) {
  const queryClient = useQueryClient();

  return useMutation<FeedbackResponse, Error, Partial<CreateFeedbackDto>>({
    mutationFn: (data: Partial<CreateFeedbackDto>) =>
      feedbackService.update(id, data),
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
