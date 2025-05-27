"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function UserAgreementContactFooter() {
  const t = useTranslations("userAgreement.footer");

  return (
    <div className="mt-10 pt-6 border-t border-gray-100">
      <p className="text-gray-600">
        {t.rich("contactText", {
          link: (chunks) => (
            <Link href="/contact" className="text-blue-600 hover:underline">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  );
}
