export interface CurrencyOption {
  id: number;
  amount: number;
  price: string;
  priceValue: number;
  originalPrice?: number;
  discountPercent?: number;
  isDiscounted?: boolean;
  type?: string;
  sku?: string;
}
