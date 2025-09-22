import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { DesignServicesBlock } from "@/widgets/ui/design-services/design-services-block/design-services-block";

export default function DesignServicesPage() {
  return (
    <ContentWrapper>
      <div className="mt-6 sm:mt-10">
        <DesignServicesBlock />
      </div>
    </ContentWrapper>
  );
}
