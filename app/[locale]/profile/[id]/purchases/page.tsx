"use client";

import { useAuthStore } from "@/entities/auth/store/auth.store";
import { useProfile } from "@/entities/user/hooks/use-profile";
import { useUpdateUser } from "@/entities/user/hooks/use-update-user";
import { ProfileHeaderEditable } from "@/entities/user/ui/profile-header-editable/profile-header-editable";
import { ProfileMenu } from "@/entities/user/ui/profile-menu/profile-menu";
import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { ProfileLoading } from "@/widgets/ui/profile-page/profile-skeleton/profile-skeleton";
import { ProfilePurchasesBlock } from "@/widgets/ui/profile-purchases-page/profile-purchases-block/profile-purchases-block";
import { ArrowLeft, Link } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function PurchasesPage() {
  return (
    <ContentWrapper>
      <ProfilePurchasesBlock />
    </ContentWrapper>
  );
}
