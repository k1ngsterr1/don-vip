import { ReviewList } from "@/entities/reviews/ui/review-list/review-list";
import { FeedbackPrompt } from "@/widgets/ui/reviews-page/prompt-block/prompt-block";

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

export default function Reviews() {
  return (
    <>
      <div className="w-full px-[11px] mt-[24px] flex flex-col items-center">
        <FeedbackPrompt />
        <div className="w-full flex items-start justify-start">
          <button className="w-[78px] h-[30px] text-[10px] bg-gray-50 rounded-md mb-2">
            Все отзывы
          </button>
        </div>
        <ReviewList reviews={reviews} />
        <button className="w-[194px] fixed bottom-[75px] h-[42px] rounded-full font-roboto font-medium text-[12px] text-white bg-blue">
          Оставить отзыв
        </button>
      </div>
    </>
  );
}
