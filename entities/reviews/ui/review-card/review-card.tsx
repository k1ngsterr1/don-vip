import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import { Review } from "../../model/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-md mb-2">
      <div className="flex items-center mb-1">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          {review.avatar ? (
            <Image
              src={review.avatar || "/placeholder.svg"}
              alt={review.author}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white">
              {review.author.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 ">
          <div className="flex flex-col items-start">
            <span className="text-blue font-medium">{review.author}</span>
            <span className="text-xs text-gray-light">{review.date}</span>
          </div>
        </div>
        <ThumbsUp
          className={`${review.liked ? "text-[#03cc60]" : "text-red-500"} `}
          size={20}
        />
      </div>
      {review.text && <p className="text-sm text-dark mt-2">{review.text}</p>}
      {review.game && (
        <div className="flex gap-2 mt-2">
          <Image
            src={"/bigo.png"}
            alt={review.author}
            width={40}
            height={40}
            className="object-cover w-[18px] h-[18px]"
          />
          <p className="text-blue text-sm ">{review.game}</p>
        </div>
      )}
    </div>
  );
}
