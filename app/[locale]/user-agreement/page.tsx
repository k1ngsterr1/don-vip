import { UserAgreementDesktop } from "@/widgets/ui/user-agreement-page/desktop/user-agreement-desktop";
import { UserAgreementMobile } from "@/widgets/ui/user-agreement-page/mobile/user-agreement-mobile";

export default function UserAgreementPage() {
  return (
    <>
      <UserAgreementDesktop />
      <UserAgreementMobile />
    </>
  );
}
