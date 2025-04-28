import { ReviewForm } from "@/entities/reviews/ui/submit-review/submit-review";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { Edit2Icon } from "lucide-react";
import Link from "next/link";

export default function SendReview() {
  return (
    <>
      <div className="w-full px-[11px] mt-[24px] flex flex-col items-center">
        <div className="w-full flex items-start justify-start mb-[24px]">
          <Link href={"/"} className="text-blue text-[15px] font-roboto">
            Вернуться
          </Link>
        </div>
        <div className="w-full flex items-start justify-start ">
          <SectionTitle
            icon={<Edit2Icon className="text-blue" size={16} />}
            title="оставить отзыв"
          />
        </div>
        <ReviewForm />
      </div>
    </>
  );
}
