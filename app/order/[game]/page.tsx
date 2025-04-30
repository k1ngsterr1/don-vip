import { OrderBlock } from "@/widgets/ui/order-page/order-block";

interface OrderPageProps {
  params: {
    game: string;
  };
}

export default function OrderPageRoute({ params }: OrderPageProps) {
  return <OrderBlock gameSlug={params.game} />;
}
