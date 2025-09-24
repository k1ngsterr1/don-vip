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
      ? "Генерация иконок - ИИ услуги | DonVip"
      : "Icon Generation - AI Services | DonVip";

  const description =
    locale === "ru"
      ? "Автоматическая генерация иконок с помощью искусственного интеллекта. Быстро, качественно и по доступной цене."
      : "Automatic AI-powered icon generation. Fast, high-quality and affordable.";

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

export default function IconGenerationPage({ params }: Props) {
  // Используем специальный ID для хардкодной услуги генерации иконок
  const iconGenerationServiceId = 9998;

  return (
    <div className="container mx-auto px-4 py-6">
      <OrderBlock gameSlug={iconGenerationServiceId} />
    </div>
  );
}
