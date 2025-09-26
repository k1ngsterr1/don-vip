export interface CurrencyOption {
  id: number;
  amount: number;
  price: string;
  priceValue: number;
  discountPercent?: number;
  type?: string;
  sku?: string;
}
