import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const url = request.nextUrl.clone();

  // Handle external Google auth callback
  if (path.startsWith("/en/google")) {
    const accessToken = url.searchParams.get("access");
    const refreshToken = url.searchParams.get("refresh");

    if (accessToken && refreshToken) {
      // Redirect to our internal callback handler with the tokens
      const redirectUrl = new URL("/auth/external-callback", request.url);
      redirectUrl.searchParams.set("access", accessToken);
      redirectUrl.searchParams.set("refresh", refreshToken);

      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle /auth/transitor with access/refresh tokens
  if (path.startsWith("/auth/transitor")) {
    const accessToken = url.searchParams.get("access");
    const refreshToken = url.searchParams.get("refresh");

    if (accessToken && refreshToken) {
      return NextResponse.next();
    }
  }

  // Handle /auth/external-callback with access/refresh tokens
  if (path.startsWith("/auth/external-callback")) {
    const accessToken = url.searchParams.get("access");
    const refreshToken = url.searchParams.get("refresh");

    if (accessToken && refreshToken) {
      return NextResponse.next();
    }
  }

  // Apply next-intl middleware for all other paths
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/auth/transitor",
    "/auth/external-callback",
    "/en/google",
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
