/**
 * Centralized query keys for TanStack Query
 * This helps maintain consistency and avoid typos across the application
 */

export const queryKeys = {
  // Auth related keys
  auth: {
    user: ["auth", "user"] as const,
    session: ["auth", "session"] as const,
  },

  // User related keys
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: any) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.users.details(), id] as const,
    profile: ["users", "profile"] as const,
  },

  // Coupon related keys
  coupons: {
    all: ["coupons"] as const,
    lists: () => [...queryKeys.coupons.all, "list"] as const,
    list: (filters: any) =>
      [...queryKeys.coupons.lists(), { filters }] as const,
    details: () => [...queryKeys.coupons.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.coupons.details(), id] as const,
  },

  // Game related keys
  games: {
    all: ["games"] as const,
    lists: () => [...queryKeys.games.all, "list"] as const,
    list: (filters: any) => [...queryKeys.games.lists(), { filters }] as const,
    details: () => [...queryKeys.games.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.games.details(), id] as const,
  },

  // Order related keys
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters: any) => [...queryKeys.orders.lists(), { filters }] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.orders.details(), id] as const,
  },
};
