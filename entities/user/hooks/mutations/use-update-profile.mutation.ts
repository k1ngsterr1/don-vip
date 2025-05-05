// entities/user/hooks/mutations/use-update-user.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/config/apiClient";

interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  avatar?: File | null;
  gender?: string;
  birth_date?: string;
  phone?: string;
}

/**
 * Hook for updating user profile with TanStack Query
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserData) => {
      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Add text fields
      if (data.first_name) formData.append("first_name", data.first_name);
      if (data.last_name) formData.append("last_name", data.last_name);
      if (data.gender) formData.append("gender", data.gender);
      if (data.birth_date) formData.append("birth_date", data.birth_date);
      if (data.phone) formData.append("phone", data.phone);

      // Add avatar if provided
      if (data.avatar) formData.append("avatar", data.avatar);

      const response = await apiClient.patch("/user/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {},
  });
}
