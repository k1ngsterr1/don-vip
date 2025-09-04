import { headers } from "next/headers";

export async function CanonicalUrl() {
  const headersList = await headers();
  const host = headersList.get("host") || "don-vip.com";
  const pathname = headersList.get("x-pathname") || "/";

  // Remove query parameters for canonical URL
  const canonicalUrl = `https://${host}${pathname.split("?")[0]}`;

  return <link rel="canonical" href={canonicalUrl} />;
}
