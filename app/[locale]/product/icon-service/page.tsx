import { OrderBlock } from "@/widgets/ui/order-page/order-block";
import type { Metadata } from "next";

type Props = {
  params: any;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const title =
    locale === "ru"
      ? "Иконка - Дизайн услуги | DonVip"
      : "Icon Design Service | DonVip";

  const description =
    locale === "ru"
      ? "Создание качественной иконки для вашего проекта. Быстро и по доступной цене."
      : "Quality icon design for your project. Fast and affordable.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ["/feature-card.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/feature-card.webp"],
    },
  };
}

export default function IconServicePage({ params }: Props) {
  // Используем специальный ID для хардкодной услуги
  // В реальном приложении это может быть настоящий ID из базы данных
  const iconServiceId = 9999; // Специальный ID для хардкодной услуги

  return (
    <div className="container mx-auto px-4 py-6">
      <OrderBlock gameSlug={iconServiceId} />
    </div>
  );
}
