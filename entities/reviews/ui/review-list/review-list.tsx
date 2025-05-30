import type { Review } from "../../model/types";
import { ReviewCard } from "../review-card/review-card";

interface ReviewListProps {
  reviews: Review[];
  isGrid?: boolean;
}

export function ReviewList({ reviews, isGrid = false }: ReviewListProps) {
  if (isGrid) {
    return (
      <>
        {reviews.map((review: any) => (
          <ReviewCard key={review.id} review={review} isGrid={true} />
        ))}
      </>
    );
  }

  return (
    <div className="space-y-2 w-full mt-8">
      {reviews.map((review: any) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
