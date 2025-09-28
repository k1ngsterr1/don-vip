/**
 * Утилиты для работы с куки
 */

interface CookieOptions {
  expires?: Date | number; // Date object or days from now
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export class CookieManager {
  /**
   * Установить куки
   */
  static set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === "undefined") return; // SSR protection

    const {
      expires,
      path = "/",
      domain,
      secure = false,
      sameSite = "lax",
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    // Handle expires
    if (expires) {
      let expiresDate: Date;
      if (typeof expires === "number") {
        expiresDate = new Date();
        expiresDate.setTime(
          expiresDate.getTime() + expires * 24 * 60 * 60 * 1000
        );
      } else {
        expiresDate = expires;
      }
      cookieString += `; expires=${expiresDate.toUTCString()}`;
    }

    if (path) cookieString += `; path=${path}`;
    if (domain) cookieString += `; domain=${domain}`;
    if (secure) cookieString += `; secure`;
    cookieString += `; SameSite=${sameSite}`;

    document.cookie = cookieString;
  }

  /**
   * Получить куки
   */
  static get(name: string): string | null {
    if (typeof document === "undefined") return null; // SSR protection

    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  }

  /**
   * Удалить куки
   */
  static remove(
    name: string,
    options: Pick<CookieOptions, "path" | "domain"> = {}
  ): void {
    const { path = "/", domain } = options;
    this.set(name, "", {
      expires: new Date(0),
      path,
      domain,
    });
  }

  /**
   * Проверить существование куки
   */
  static exists(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * Получить все куки как объект
   */
  static getAll(): Record<string, string> {
    if (typeof document === "undefined") return {}; // SSR protection

    const cookies: Record<string, string> = {};
    const cookieArray = document.cookie.split(";");

    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      const [name, value] = cookie.split("=");
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }

    return cookies;
  }
}

// Константы для имен куки
export const COOKIE_NAMES = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_PREFERENCES: "user_preferences",
  GUEST_CLIENT_ID: "guest_client_id",
  RECENT_ORDERS: "recent_orders",
  LAST_SUCCESSFUL_ORDER: "last_successful_order",
  SAVED_GAME_DATA: "saved_game_data",
  USER_CURRENCY: "user_currency",
  USER_COUNTRY: "user_country",
} as const;

// Типы для сохраняемых данных
export interface SavedOrderData {
  orderId: number;
  accountId: string;
  serverId?: string;
  gameId: number;
  gameName: string;
  timestamp: number;
}

export interface SavedGameData {
  gameId: number;
  accountId: string;
  serverId?: string;
  gameName: string;
  lastUsed: number;
}

export interface UserPreferences {
  currency: string;
  country: string;
  language: string;
  savedGameData: SavedGameData[];
  recentOrders: SavedOrderData[];
}

/**
 * Специализированные функции для работы с куки приложения
 */
export class AppCookies {
  /**
   * Сохранить данные успешного заказа
   */
  static saveSuccessfulOrder(orderData: SavedOrderData): void {
    try {
      const recentOrders = this.getRecentOrders();

      // Добавляем новый заказ в начало списка
      const updatedOrders = [
        orderData,
        ...recentOrders.filter((order) => order.orderId !== orderData.orderId),
      ];

      // Оставляем только последние 10 заказов
      const limitedOrders = updatedOrders.slice(0, 10);

      CookieManager.set(
        COOKIE_NAMES.RECENT_ORDERS,
        JSON.stringify(limitedOrders),
        {
          expires: 365, // 1 год
        }
      );

      // Сохраняем последний успешный заказ отдельно
      CookieManager.set(
        COOKIE_NAMES.LAST_SUCCESSFUL_ORDER,
        JSON.stringify(orderData),
        {
          expires: 365,
        }
      );

      // Сохраняем данные игры для быстрого доступа
      this.saveGameData({
        gameId: orderData.gameId,
        accountId: orderData.accountId,
        serverId: orderData.serverId,
        gameName: orderData.gameName,
        lastUsed: Date.now(),
      });
    } catch (error) {
      console.error("Error saving successful order:", error);
    }
  }

  /**
   * Получить список недавних заказов
   */
  static getRecentOrders(): SavedOrderData[] {
    try {
      const ordersData = CookieManager.get(COOKIE_NAMES.RECENT_ORDERS);
      return ordersData ? JSON.parse(ordersData) : [];
    } catch (error) {
      console.error("Error getting recent orders:", error);
      return [];
    }
  }

  /**
   * Получить последний успешный заказ
   */
  static getLastSuccessfulOrder(): SavedOrderData | null {
    try {
      const orderData = CookieManager.get(COOKIE_NAMES.LAST_SUCCESSFUL_ORDER);
      return orderData ? JSON.parse(orderData) : null;
    } catch (error) {
      console.error("Error getting last successful order:", error);
      return null;
    }
  }

  /**
   * Сохранить данные игры (ID и сервер)
   */
  static saveGameData(gameData: SavedGameData): void {
    try {
      const savedGames = this.getSavedGameData();

      // Обновляем или добавляем данные игры
      const updatedGames = savedGames.filter(
        (game) =>
          !(
            game.gameId === gameData.gameId &&
            game.accountId === gameData.accountId
          )
      );
      updatedGames.unshift(gameData);

      // Оставляем только последние 5 игр
      const limitedGames = updatedGames.slice(0, 5);

      CookieManager.set(
        COOKIE_NAMES.SAVED_GAME_DATA,
        JSON.stringify(limitedGames),
        {
          expires: 365,
        }
      );
    } catch (error) {
      console.error("Error saving game data:", error);
    }
  }

  /**
   * Получить сохраненные данные игр
   */
  static getSavedGameData(): SavedGameData[] {
    try {
      const gameData = CookieManager.get(COOKIE_NAMES.SAVED_GAME_DATA);
      return gameData ? JSON.parse(gameData) : [];
    } catch (error) {
      console.error("Error getting saved game data:", error);
      return [];
    }
  }

  /**
   * Получить сохраненные данные для конкретной игры
   */
  static getGameData(gameId: number): SavedGameData | null {
    const savedGames = this.getSavedGameData();
    return savedGames.find((game) => game.gameId === gameId) || null;
  }

  /**
   * Сохранить пользовательские предпочтения
   */
  static saveUserPreferences(preferences: Partial<UserPreferences>): void {
    try {
      const currentPrefs = this.getUserPreferences();
      const updatedPrefs = { ...currentPrefs, ...preferences };

      CookieManager.set(
        COOKIE_NAMES.USER_PREFERENCES,
        JSON.stringify(updatedPrefs),
        {
          expires: 365,
        }
      );
    } catch (error) {
      console.error("Error saving user preferences:", error);
    }
  }

  /**
   * Получить пользовательские предпочтения
   */
  static getUserPreferences(): UserPreferences {
    try {
      const prefsData = CookieManager.get(COOKIE_NAMES.USER_PREFERENCES);
      const defaultPrefs: UserPreferences = {
        currency: "RUB",
        country: "RU",
        language: "ru",
        savedGameData: [],
        recentOrders: [],
      };

      return prefsData
        ? { ...defaultPrefs, ...JSON.parse(prefsData) }
        : defaultPrefs;
    } catch (error) {
      console.error("Error getting user preferences:", error);
      return {
        currency: "RUB",
        country: "RU",
        language: "ru",
        savedGameData: [],
        recentOrders: [],
      };
    }
  }

  /**
   * Сгенерировать и сохранить ID гостевого клиента
   */
  static generateGuestClientId(): string {
    const existingId = CookieManager.get(COOKIE_NAMES.GUEST_CLIENT_ID);
    if (existingId) return existingId;

    const guestId = `guest_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    CookieManager.set(COOKIE_NAMES.GUEST_CLIENT_ID, guestId, {
      expires: 365, // 1 год
    });

    return guestId;
  }

  /**
   * Получить ID гостевого клиента
   */
  static getGuestClientId(): string | null {
    return CookieManager.get(COOKIE_NAMES.GUEST_CLIENT_ID);
  }

  /**
   * Очистить все куки приложения (кроме авторизации)
   */
  static clearAppCookies(): void {
    CookieManager.remove(COOKIE_NAMES.GUEST_CLIENT_ID);
    CookieManager.remove(COOKIE_NAMES.RECENT_ORDERS);
    CookieManager.remove(COOKIE_NAMES.LAST_SUCCESSFUL_ORDER);
    CookieManager.remove(COOKIE_NAMES.SAVED_GAME_DATA);
    CookieManager.remove(COOKIE_NAMES.USER_PREFERENCES);
  }
}
