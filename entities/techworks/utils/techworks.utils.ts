import { techworksApi } from "../api/techworks.api";

/**
 * Simple utility function to check techworks status without side effects.
 * Useful for components that need to check status without redirecting.
 */
export const checkTechworksStatus = async (): Promise<boolean> => {
  try {
    return await techworksApi.checkTechworksStatus();
  } catch (error) {
    console.error("Error checking techworks status:", error);
    return false;
  }
};

/**
 * React hook that provides techworks status without redirecting.
 * Useful for components that need to conditionally render based on techworks status.
 */
export const useTechworksStatus = () => {
  const [isTechworksActive, setIsTechworksActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const isActive = await techworksApi.checkTechworksStatus();
      setIsTechworksActive(isActive);
      return isActive;
    } catch (err) {
      console.error("Error checking techworks status:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    isTechworksActive,
    isLoading,
    error,
    refreshStatus: checkStatus,
  };
};

export { useTechworksStatus };
