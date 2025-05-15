// app/[locale]/reviews/page.tsx или аналогичный путь
import { ContentWrapper } from "@/shared/ui/content-wrapper/content-wrapper";
import { ReviewsBlock } from "@/widgets/ui/reviews-page/reviews-block/reviews-block";

export default function Reviews() {
  return (
    <ContentWrapper>
      <ReviewsBlock />
    </ContentWrapper>
  );
}
