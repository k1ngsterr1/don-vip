import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: {
      ...(await import(`../messages/${locale}/privacy-policy.json`)),
      ...(await import(`../messages/${locale}/login.json`)),
      ...(await import(`../messages/${locale}/forgotpass.json`)),
      ...(await import(`../messages/${locale}/register.json`)),
      ...(await import(`../messages/${locale}/forgotpassfailed.json`)),
      ...(await import(`../messages/${locale}/forgotpasssuccess.json`)),
      ...(await import(`../messages/${locale}/login-form.json`)),
      ...(await import(`../messages/${locale}/register-form.json`)),
      ...(await import(`../messages/${locale}/registersuccess.json`)),
      ...(await import(`../messages/${locale}/coupon-widget.json`)),
      ...(await import(`../messages/${locale}/header.json`)),
      ...(await import(`../messages/${locale}/mobile-faq.json`)),
      ...(await import(`../messages/${locale}/desktop-faq.json`)),
      ...(await import(`../messages/${locale}/profile-edit-form.json`)),
      ...(await import(`../messages/${locale}/profile-menu.json`)),
      ...(await import(`../messages/${locale}/mobile-public-offer.json`)),
      ...(await import(`../messages/${locale}/desktop-public-offer.json`)),
      ...(await import(`../messages/${locale}/public-offer-sidebar.json`)),
      ...(await import(`../messages/${locale}/public-offer-content.json`)),
      ...(await import(`../messages/${locale}/public-offer-footer.json`)),
      ...(await import(`../messages/${locale}/sumbit-review.json`)),
      ...(await import(`../messages/${locale}/currency-selector.json`)),
      ...(await import(`../messages/${locale}/payment-method-selector.json`)),
      ...(await import(`../messages/${locale}/footer.json`)),
      ...(await import(`../messages/${locale}/games-mega-menu.json`)),
      ...(await import(`../messages/${locale}/services-mega-menu.json`)),
      ...(await import(`../messages/${locale}/social-input.json`)),
      ...(await import(`../messages/${locale}/mobile-games.json`)),
      ...(await import(`../messages/${locale}/faq-data.json`)),
      ...(await import(`../messages/${locale}/faq-categories.json`)),
    },
  };
});
