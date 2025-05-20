import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ru"],

  // Used when no locale matches
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

    "/contact": "/contact",
    "/faq": "/faq",
    "/coupons": "/coupons",
    "/google": "/google",
    "/privacy-policy": "/privacy-policy",
    "/public-offer": "/public-offer",
    "/payment/success": "/payment/success",
    "/payment/failed": "/payment/failed",

    "/product": "/product",
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
