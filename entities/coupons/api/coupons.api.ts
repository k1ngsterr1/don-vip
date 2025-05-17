import { apiClient } from "@/shared/config/apiClient";

// Types
export interface Coupon {
  id: number;
  code: string;
  limit?: number;
  discount: number;
}

export interface CheckCouponDto {
  code: string;
}

export interface CreateCouponDto {
  code: string;
  limit?: number;
  discount: number;
}

export interface UpdateCouponDto {
  id?: number;
  code?: string;
  limit?: number;
  discount?: number;
}

export interface CouponValidityResult {
  valid: boolean;
  coupon?: Coupon;
  message?: string;
}

export interface ApplyCouponDto {
  code: string;
  user_id: number;
}

/**
 * Coupon API client for coupon-related operations
 */
export const couponApi = {
  /**
   * Check a coupon code
   */
  checkCoupon: async (data: CheckCouponDto): Promise<CouponValidityResult> => {
    const response = await apiClient.get("/coupon/check", { params: data });
    return response.data;
  },

  /**
   * Get all coupons (admin only)
   */
  getAllCoupons: async (): Promise<Coupon[]> => {
    const response = await apiClient.get("/coupon/all");
    return response.data;
  },

  /**
   * Create a new coupon (admin only)
   */
  createCoupon: async (data: CreateCouponDto): Promise<Coupon> => {
    const response = await apiClient.post("/coupon", data);
    return response.data;
  },

  /**
   * Update a coupon (admin only)
   */
  updateCoupon: async (data: UpdateCouponDto): Promise<Coupon> => {
    const response = await apiClient.patch(`/coupon/${data.id}`, data);
    return response.data;
  },

  /**
   * Delete a coupon (admin only)
   */
  deleteCoupon: async (id: number): Promise<void> => {
    await apiClient.delete(`/coupon/${id}`);
  },

  applyCoupon: async (
    data: ApplyCouponDto
  ): Promise<{
    message: string;
    code: string;
    user_id: string;
    discount: number;
  }> => {
    const response = await apiClient.post("/coupon/apply", data);
    return response.data;
  },
};
