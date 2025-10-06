import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://don-vip.com";

  // Define main pages for both locales with priorities
  const mainPages = [
    { path: "", priority: 1.0, changeFreq: "daily" as const },
    { path: "/catalog", priority: 0.9, changeFreq: "daily" as const },
    { path: "/games", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/services", priority: 0.8, changeFreq: "weekly" as const },
    { path: "/reviews", priority: 0.7, changeFreq: "weekly" as const },
    { path: "/contact", priority: 0.6, changeFreq: "monthly" as const },
    { path: "/faq", priority: 0.6, changeFreq: "monthly" as const },
    { path: "/privacy-policy", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/public-offer", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/user-agreement", priority: 0.3, changeFreq: "yearly" as const },
  ];

  // Product pages (games)
  const productPages = [
    { path: "/product/1", priority: 0.8, changeFreq: "weekly" as const }, // Bigo
    { path: "/product/2", priority: 0.8, changeFreq: "weekly" as const }, // Mobile Legends
    { path: "/product/3", priority: 0.8, changeFreq: "weekly" as const }, // PUBG
  ];

  // Service categories
  const servicePages = [
    { path: "/product-services", priority: 0.7, changeFreq: "weekly" as const },
    {
      path: "/services/game-currency",
      priority: 0.7,
      changeFreq: "weekly" as const,
    },
    { path: "/services/top-up", priority: 0.7, changeFreq: "weekly" as const },
  ];

  const locales = ["ru", "en"];
  const urls: MetadataRoute.Sitemap = [];

  // Add main pages for each locale
  locales.forEach((locale) => {
    mainPages.forEach((page) => {
      urls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    });

    // Add product pages
    productPages.forEach((page) => {
      urls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    });

    // Add service pages
    servicePages.forEach((page) => {
      urls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    });
  });

  // Add language-specific alternative pages
  urls.push({
    url: `${baseUrl}/language-currency`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  });

  return urls;
}
