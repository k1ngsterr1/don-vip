import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { ServicesBlock } from "@/widgets/ui/main-page/services-block/services-block";

export default function ServicesPage() {
  return (
    <ContentWrapper>
      <div className="mt-6 sm:mt-10">
        <ServicesBlock />
      </div>
    </ContentWrapper>
  );
}
