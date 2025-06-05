"use client";

import { useEffect, useState } from "react";
import CountdownTimer from "@/features/countdown/countdown";
import Image from "next/image";
import {
  techworksApi,
  type Techwork,
} from "@/entities/techworks/api/techworks.api";

export default function TechworksPage() {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechwork = async () => {
      try {
        const data: Techwork = await techworksApi.getTechwork();

        if (data.techWorksEndsAt) {
          const parsedDate = new Date(data.techWorksEndsAt);
          setTargetDate(parsedDate);
        } else {
          const fallbackDate = new Date();
          fallbackDate.setHours(fallbackDate.getHours() + 2);
          setTargetDate(fallbackDate);
        }
      } catch (error) {
        console.error("[TechworksPage] Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechwork();
  }, []);

  if (loading || !targetDate) return null;

  return (
    <div className="relative w-full h-[100vh] overflow-hidden">
      <Image
        src="/techworks.webp"
        alt="Techworks Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 top-[64px] left-[16px]">
        <h1 className="text-white font-black w-full font-unbounded text-[45px]">
          Внимание! <br />
          Технические работы
        </h1>
      </div>

      <div className="absolute w-[90%] bottom-[0px] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CountdownTimer targetDate={targetDate} />
      </div>
    </div>
  );
}
