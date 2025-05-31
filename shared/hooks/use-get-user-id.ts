import { useAuthStore } from "@/entities/auth/store/auth.store";
import { apiClient } from "../config/apiClient";
import { authApi } from "@/entities/auth/api/auth.api";

// Add a flag to track ongoing getUserId requests
let isGetUserIdInProgress = false;
let cachedUserId: string | null = null;

export const getUserId = async (): Promise<string | undefined> => {
  if (typeof window === "undefined")
    throw new Error("❌ getUserId called on server");

  // If we have a cached user ID, return it immediately
  if (cachedUserId) {
    return cachedUserId;
  }

  const userId = localStorage.getItem("userId");
  if (userId) {
    cachedUserId = userId;
    return cachedUserId;
  }

  const { user, setUser, isGuestAuth, setGuestAuth } = useAuthStore.getState();
  const isNumber = (val: string) => /^\d+$/.test(val);

  // If we already have a user with valid ID, return it
  if (user?.id && isNumber(user.id.toString())) {
    console.log("👤 [Auth] #23 - getUserId: Using existing user ID", user.id);
    cachedUserId = user.id.toString();
    return user.id.toString();
  }

  // Check if a getUserId request is already in progress
  if (isGetUserIdInProgress) {
    console.log(
      "👤 [Auth] #23.2 - getUserId: Request already in progress, waiting..."
    );
    // Wait for the existing request to complete (simple polling)
    let attempts = 0;
    while (isGetUserIdInProgress && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    // After waiting, check if we have a user ID now
    if (cachedUserId) {
      console.log(
        "👤 [Auth] #23.3 - getUserId: Using cached user ID after waiting",
        cachedUserId
      );
      return cachedUserId;
    }
  }

  try {
    // Set the flag to prevent concurrent requests
    isGetUserIdInProgress = true;

    // Try to get the current user
    const response = await authApi.getCurrentUser();
    const fetchedUser = response.data;

    if (fetchedUser?.id && isNumber(fetchedUser.id.toString())) {
      setUser(fetchedUser);
      setGuestAuth(false); // Explicitly set as not a guest

      cachedUserId = fetchedUser.id.toString();
      isGetUserIdInProgress = false;
      return fetchedUser.id.toString();
    }
  } catch (error: any) {
    if (error.response?.statusCode === 401) {
      console.warn(
        "👤 [Auth] #26 - getUserId: 401 Unauthorized, creating guest user"
      );
    } else {
      console.warn("👤 [Auth] #27 - getUserId: Error fetching user:", error);
    }
  }

  // Check if already authenticated as guest before making another request
  if (isGuestAuth && user?.id && isNumber(user.id.toString())) {
    console.log(
      "👤 [Auth] #28 - getUserId: Already a guest user, using existing ID",
      user.id
    );
    cachedUserId = user.id.toString();
    isGetUserIdInProgress = false;
    return user.id.toString();
  }

  // If all else fails, reset the flag and return undefined
  isGetUserIdInProgress = false;
  return undefined;
};
