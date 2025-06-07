export interface Bank {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BanksResponse {
  data: Bank[];
  total: number;
  page: number;
  limit: number;
}
