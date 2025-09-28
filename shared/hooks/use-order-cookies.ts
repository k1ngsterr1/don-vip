import { useCallback } from "react";
import {
  AppCookies,
  type SavedOrderData,
  type SavedGameData,
} from "@/shared/utils/cookies";

/**
 * Hook для работы с сохранением данных заказов и игр в куки
 */
export const useOrderCookies = () => {
  /**
   * Сохранить данные успешного заказа
   */
  const saveSuccessfulOrder = useCallback((orderData: SavedOrderData) => {
    AppCookies.saveSuccessfulOrder(orderData);
  }, []);

  /**
   * Получить список недавних заказов
   */
  const getRecentOrders = useCallback((): SavedOrderData[] => {
    return AppCookies.getRecentOrders();
  }, []);

  /**
   * Получить последний успешный заказ
   */
  const getLastSuccessfulOrder = useCallback((): SavedOrderData | null => {
    return AppCookies.getLastSuccessfulOrder();
  }, []);

  /**
   * Сохранить данные игры (ID пользователя и сервер)
   */
  const saveGameData = useCallback((gameData: SavedGameData) => {
    AppCookies.saveGameData(gameData);
  }, []);

  /**
   * Получить сохраненные данные для игры
   */
  const getGameData = useCallback((gameId: number): SavedGameData | null => {
    return AppCookies.getGameData(gameId);
  }, []);

  /**
   * Получить все сохраненные данные игр
   */
  const getAllSavedGameData = useCallback((): SavedGameData[] => {
    return AppCookies.getSavedGameData();
  }, []);

  /**
   * Получить или создать ID гостевого клиента
   */
  const getOrCreateGuestId = useCallback((): string => {
    return AppCookies.generateGuestClientId();
  }, []);

  /**
   * Получить ID гостевого клиента (если существует)
   */
  const getGuestId = useCallback((): string | null => {
    return AppCookies.getGuestClientId();
  }, []);

  /**
   * Сохранить предпочтения пользователя
   */
  const saveUserPreferences = useCallback(
    (preferences: {
      currency?: string;
      country?: string;
      language?: string;
    }) => {
      AppCookies.saveUserPreferences(preferences);
    },
    []
  );

  /**
   * Получить предпочтения пользователя
   */
  const getUserPreferences = useCallback(() => {
    return AppCookies.getUserPreferences();
  }, []);

  /**
   * Автоматически заполнить форму данными из последнего заказа для игры
   */
  const fillFormFromLastOrder = useCallback((gameId: number) => {
    const gameData = AppCookies.getGameData(gameId);
    const recentOrders = AppCookies.getRecentOrders();

    // Найти последний заказ для этой игры
    const lastOrderForGame = recentOrders.find(
      (order) => order.gameId === gameId
    );

    return {
      accountId: gameData?.accountId || lastOrderForGame?.accountId || "",
      serverId: gameData?.serverId || lastOrderForGame?.serverId || "",
      hasData: !!(gameData || lastOrderForGame),
    };
  }, []);

  /**
   * Получить статистику по заказам
   */
  const getOrderStats = useCallback(() => {
    const recentOrders = AppCookies.getRecentOrders();
    const savedGames = AppCookies.getSavedGameData();

    return {
      totalOrders: recentOrders.length,
      totalGames: savedGames.length,
      lastOrderDate: recentOrders[0]?.timestamp || null,
      mostPlayedGame: savedGames.reduce(
        (prev, current) => (prev.lastUsed > current.lastUsed ? prev : current),
        savedGames[0] || null
      ),
    };
  }, []);

  return {
    saveSuccessfulOrder,
    getRecentOrders,
    getLastSuccessfulOrder,
    saveGameData,
    getGameData,
    getAllSavedGameData,
    getOrCreateGuestId,
    getGuestId,
    saveUserPreferences,
    getUserPreferences,
    fillFormFromLastOrder,
    getOrderStats,
  };
};
