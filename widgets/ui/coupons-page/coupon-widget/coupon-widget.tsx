import SectionTitle from "@/shared/ui/section-title/section-title";
import { Ticket } from "lucide-react";
import Link from "next/link";

export function CouponsHeaderWidget() {
  return (
    <>
      <div className="flex items-center mb-4 mt-[24px]">
        <Link href="/" className="text-blue">
          Вернуться
        </Link>
      </div>

      <div className="flex items-center mb-6">
        <SectionTitle
          icon={<Ticket className="text-blue" size={16} />}
          title="купоны"
        />
      </div>
    </>
  );
}
