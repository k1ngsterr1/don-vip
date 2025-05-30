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
      ...(await import(`../messages/${locale}/auth-popup.json`)),
      ...(await import(`../messages/${locale}/history.json`)),
      ...(await import(`../messages/${locale}/popup.json`)),
      ...(await import(`../messages/${locale}/search.json`)),
      ...(await import(`../messages/${locale}/popup.json`)),
      ...(await import(`../messages/${locale}/verification-popup.json`)),
      ...(await import(`../messages/${locale}/forgotpasssuccess.json`)),
      ...(await import(`../messages/${locale}/google-auth.json`)),
      ...(await import(`../messages/${locale}/alert.json`)),
      ...(await import(`../messages/${locale}/payment-success.json`)),
      ...(await import(`../messages/${locale}/payment-failed.json`)),
      ...(await import(`../messages/${locale}/verify-auth.json`)),
      ...(await import(`../messages/${locale}/auth_success.json`)),
      ...(await import(`../messages/${locale}/payment-tbank.json`)),
      ...(await import(`../messages/${locale}/profile-purchase.json`)),
      ...(await import(`../messages/${locale}/contacts.json`)),
      ...(await import(`../messages/${locale}/user-agreement.json`)),
      ...(await import(`../messages/${locale}/t-bank.json`)),
      ...(await import(`../messages/${locale}/send-review.json`)),
      ...(await import(`../messages/${locale}/empty-faq.json`)),
      ...(await import(`../messages/${locale}/metadata.json`)),
      ...(await import(`../messages/${locale}/profile-edit.json`)),
      ...(await import(`../messages/${locale}/review-card.json`)),
      ...(await import(`../messages/${locale}/password.json`)),
      ...(await import(`../messages/${locale}/services.json`)),
      ...(await import(`../messages/${locale}/order-summary.json`)),
      ...(await import(`../messages/${locale}/forgotpass.json`)),
      ...(await import(`../messages/${locale}/order-block.json`)),
      ...(await import(`../messages/${locale}/empty-coupons.json`)),
      ...(await import(`../messages/${locale}/coupons-input.json`)),
      ...(await import(`../messages/${locale}/register.json`)),
      ...(await import(`../messages/${locale}/reviews.json`)),
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
      ...(await import(`../messages/${locale}/auth.json`)),
      ...(await import(`../messages/${locale}/feedback.json`)),
      ...(await import(`../messages/${locale}/reset-password.json`)),
    },
  };
});
