// import { useMutation } from "@tanstack/react-query";

// export const useRefreshToken = () => {
//   const { setTokens } = useAuthStore();

//   return useMutation({
//     mutationFn: (refreshToken: string) =>
//       authService.refreshToken(refreshToken),
//     onSuccess: (data, variables) => {
//       // Get current refresh token
//       const currentTokens = JSON.parse(
//         localStorage.getItem("auth_tokens") || "{}"
//       );

//       // Update tokens with new access token
//       const updatedTokens = {
//         access_token: data.access_token,
//         refresh_token: currentTokens.refresh_token || variables,
//       };

//       // Store updated tokens
//       localStorage.setItem("auth_tokens", JSON.stringify(updatedTokens));

//       // Update auth state
//       setTokens(updatedTokens);
//     },
//   });
// };
