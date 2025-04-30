import SectionTitle from "@/shared/ui/section-title/section-title";
import { ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";

export function CouponsHeaderWidget() {
  return (
    <>
      <div className="flex items-center mb-4 mt-[24px] md:mt-0">
        <Link
          href="/"
          className="text-blue hover:text-blue-700 transition-colors flex items-center group"
        >
          <ArrowLeft
            size={16}
            className="mr-1 group-hover:-translate-x-1 transition-transform"
          />
          <span className="hover:underline">Вернуться</span>
        </Link>
      </div>

      <div className="flex items-center mb-6 md:mb-10">
        <SectionTitle
          icon={<Ticket className="text-blue" size={20} />}
          title="купоны"
          className="md:text-center md:justify-center md:w-full"
          description="Используйте купоны для получения скидок на ваши любимые игры и сервисы"
        />
      </div>
    </>
  );
}
