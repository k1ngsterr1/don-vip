import { OrderBlock } from "@/widgets/ui/order-page/order-block";
import { Metadata } from "next";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = {
  params: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { game } = await params;

  return {
    title: `Игра: ${game}`,
  };
}

export default async function OrderPageRoute({ params }: Props) {
  const { game } = await params;

  return <OrderBlock gameSlug={game} />;
}
