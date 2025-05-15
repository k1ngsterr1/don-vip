"use client";

import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { ProfilePurchasesBlock } from "@/widgets/ui/profile-purchases-page/profile-purchases-block/profile-purchases-block";

export default function PurchasesPage() {
  return (
    <ContentWrapper>
      <ProfilePurchasesBlock />
    </ContentWrapper>
  );
}
