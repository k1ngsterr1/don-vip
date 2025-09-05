import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru"],

  defaultLocale: "ru",
  pathnames: {
    "/": "/",
    "/auth": "/auth",

    "/auth/login": "/auth/login",
    "/auth/register": "/auth/register",
    "/auth/forgot-password": "/auth/forgot-password",
    "/auth/success": "/auth/success",
    "/auth/verify": "/auth/verify",
    "/auth/transitor": "/auth/transitor",
    "/auth/external-callback": "/auth/external-callback",
    "/auth/loading": "/auth/loading",
    "/reset-password": "/reset-password",

    "/contact": "/contact",
    "/games": "/games",
    "/faq": "/faq",
    "/language-currency": "/language-currency",

    "/services": "/services",

    "/coupons": "/coupons",
    "/google": "/google",
    "/privacy-policy": "/privacy-policy",
    "/public-offer": "/public-offer",
    "/payment/success": "/payment/success",
    "/payment/failed": "/payment/failed",

    "/product": "/product",
    "/product/[id]": "/product/[id]",
    "/product/[game]": "/product/[game]",
    "/product/success": "/product/success",

    "/profile/[id]": "/profile/[id]",
    "/profile/[id]/edit": "/profile/[id]/edit",
    "/profile/[id]/purchases": "/profile/[id]/purchases",
    "/reviews": "/reviews",
    "/send-review": "/send-review",
    "/t-bank": "/t-bank",
    "/user-agreement": "/user-agreement",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const {
  Link,
  permanentRedirect,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);
