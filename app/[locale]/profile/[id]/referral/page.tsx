"use client";

import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { ReferralSystem } from "@/entities/user/ui/referral-system/referral-system";

export default function ReferralPage() {
  return (
    <ContentWrapper>
      <div className="md:max-w-6xl md:mx-auto md:px-8 md:py-8 lg:py-12">
        <ReferralSystem />
      </div>
    </ContentWrapper>
  );
}
