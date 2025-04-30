import type { Review } from "../../model/types";
import { ReviewCard } from "../review-card/review-card";

interface ReviewListProps {
  reviews: Review[];
  isGrid?: boolean;
}

export function ReviewList({ reviews, isGrid = false }: ReviewListProps) {
  if (isGrid) {
    // For tablet/desktop grid layout, we return the individual cards
    // This allows the parent to control the grid layout
    return (
      <>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} isGrid={true} />
        ))}
      </>
    );
  }

  // For mobile, we keep the original stacked layout
  return (
    <div className="space-y-2 w-full">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
