import { apiClient } from "@/shared/config/apiClient";
import { useQuery } from "@tanstack/react-query";

interface CouponValidationResponse {
  valid: boolean;
  discount?: number;
  amount?: number;
  type?: string;
  discount_type?: "percentage" | "fixed";
  description?: string;
  expires_at?: string;
  expiry_date?: string;
  status: any;
  message?: string;
  error_code?: number;
}

const validateCoupon = async (
  code: string
): Promise<CouponValidationResponse> => {
  const response = await apiClient.get(`/coupon/check`, {
    params: { code },
  });
  return response.data;
};

export const useCouponValidation = (code: string, enabled = false) => {
  return useQuery({
    queryKey: ["coupon-validation", code],
    queryFn: () => validateCoupon(code),
    enabled: enabled && !!code.trim(),
    retry: false, // Don't retry on failed coupon validation
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
