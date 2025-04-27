import { ReviewForm } from "@/entities/reviews/ui/submit-review/submit-review";
import SectionTitle from "@/shared/ui/section-title/section-title";
import { Edit2Icon } from "lucide-react";
import Link from "next/link";

const reviews = [
  {
    id: "1",
    author: "Dante Asmo",
    date: "17 мар. 2025 г.",
    text: "Отличный сервис! Все пришло очень быстро. Сначала думал что развод, а нет, все четко. Большое спасибо!",
    liked: true,
    avatar: "/mavrodi.png",
  },
  {
    id: "2",
    author: "Mobile Legends: Bang Bang",
    date: "",
    text: "Больше не обращусь к этому сервису! Из-за вас, моя борода выпала, а на голове выросли кучерявые волосы!",
    liked: false,
    game: "Mobile Legends: Bang Bang",
    avatar: "/mavrodi.png",
  },
  {
    id: "3",
    author: "Zhora Boroda",
    date: "15 мар. 2025 г.",
    text: "Больше не обращусь к этому сервису! Из-за вас, моя борода выпала, а на голове выросли кучерявые волосы!",
    liked: true,
    avatar: "/mavrodi.png",
  },

  {
    id: "5",
    author: "Davo Marshal",
    date: "12 мар. 2025 г.",
    text: "Брат джан, спасибо за классный сервис! Кайфую, от скорости, всегда буду теперь тут покупать!",
    liked: true,
    avatar: "/mavrodi.png",
  },

  {
    id: "7",
    author: "Алексей Петров",
    date: "10 мар. 2025 г.",
    text: "Быстро, надежно, без проблем. Рекомендую всем!",
    liked: true,
    avatar: "/mavrodi.png",
  },
  {
    id: "8",
    author: "Мария Иванова",
    date: "8 мар. 2025 г.",
    text: "Очень довольна сервисом. Буду обращаться еще!",
    liked: true,
    avatar: "/mavrodi.png",
  },
];

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
