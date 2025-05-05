export interface Coupon {
  id: number;
  code: string;
  limit?: number;
  discount: number;
  game?: string;
  minAmount?: number;
}

export interface CouponData {
  code: string;
  game?: string;
  discount: number;
  minAmount?: number;
}
