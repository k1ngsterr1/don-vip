import { useQuery } from "@tanstack/react-query";
import { gamesApi, type GameContent } from "../api/games.api";

export const useGameContent = (gameId: string) => {
  return useQuery<GameContent, Error>({
    queryKey: ["gameContent", gameId],
    queryFn: () => gamesApi.getGameContent(gameId),
    enabled: !!gameId, // Only run query if gameId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
