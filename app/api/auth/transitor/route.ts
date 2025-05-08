import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the URL and extract tokens
    const url = new URL(request.url);
    const accessToken = url.searchParams.get("access");
    const refreshToken = url.searchParams.get("refresh");

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "Missing tokens in URL" },
        { status: 400 }
      );
    }

    // Create a response that redirects to our transitor page
    const redirectUrl = new URL("/auth/transitor", request.url);
    redirectUrl.searchParams.set("access", accessToken);
    redirectUrl.searchParams.set("refresh", refreshToken);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in auth transitor API:", error);
    return NextResponse.json(
      { error: "Failed to process authentication" },
      { status: 500 }
    );
  }
}
