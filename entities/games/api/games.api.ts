import { apiClient, extractErrorMessage } from "@/shared/config/apiClient";

export interface InstructionStep {
  id: string;
  text: string;
  text_en?: string;
  highlight?: string;
  highlight_en?: string;
}

export interface InstructionImage {
  id: string;
  src: string;
  alt: string;
  alt_en?: string;
  width?: number;
  height?: number;
}

export interface GameInstruction {
  steps: InstructionStep[];
  images: InstructionImage[];
  headerText?: string;
  headerText_en?: string;
}

export interface GameContent {
  gameId: string;
  gameName: string;
  gameName_en?: string;
  instruction: GameInstruction;
  description: string;
  description_en?: string;
  reviews: any[];
  faq: Array<{
    id: string;
    question: string;
    question_en?: string;
    answer: string;
    answer_en?: string;
  }>;
  metadata: {
    totalReviews: number;
    averageRating: number;
    lastUpdated: string;
  };
}

export interface GameContentResponse {
  total: number;
  games: GameContent[];
}

export const gamesApi = {
  /**
   * Get game content by game ID
   * GET /game-content
   */
  getGameContent: async (gameId: string): Promise<GameContent> => {
    try {
      // Попробуем сначала публичный эндпоинт
      let response;
      try {
        response = await apiClient.get<GameContentResponse>(
          `/public/game-content`
        );
      } catch (publicError) {
        // Если публичный эндпоинт недоступен, используем обычный
        console.log("Public endpoint not available, trying regular endpoint");
        response = await apiClient.get<GameContentResponse>(`/game-content`);
      }

      console.log("Game content response:", response.data);

      // Find the game with matching gameId
      const game = response.data.games.find((game) => game.gameId === gameId);

      if (!game) {
        // Если игра не найдена, возвращаем пустые данные вместо ошибки
        console.warn(
          `Game with ID "${gameId}" not found, returning empty content`
        );
        return {
          gameId: gameId,
          gameName: gameId,
          instruction: {
            headerText: "Инструкция",
            steps: [],
            images: [],
          },
          description: "",
          reviews: [],
          faq: [],
          metadata: {
            totalReviews: 0,
            averageRating: 0,
            lastUpdated: new Date().toISOString(),
          },
        };
      }

      return game;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.warn(
        "Error fetching game content, returning empty content:",
        errorMessage
      );

      // Возвращаем пустые данные вместо ошибки
      return {
        gameId: gameId,
        gameName: gameId,
        instruction: {
          headerText: "Инструкция",
          steps: [],
          images: [],
        },
        description: "",
        reviews: [],
        faq: [],
        metadata: {
          totalReviews: 0,
          averageRating: 0,
          lastUpdated: new Date().toISOString(),
        },
      };
    }
  },
};
