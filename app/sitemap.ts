import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://don-vip.com";

  // Define main pages for both locales
  const pages = [
    "",
    "/games",
    "/services",
    "/contact",
    "/faq",
    "/reviews",
    "/privacy-policy",
    "/public-offer",
    "/user-agreement",
  ];

  const locales = ["ru", "en"];
  const urls: MetadataRoute.Sitemap = [];

  // Add pages for each locale
  locales.forEach((locale) => {
    pages.forEach((page) => {
      urls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1.0 : 0.8,
      });
    });
  });

  return urls;
}
