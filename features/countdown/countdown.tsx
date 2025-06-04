"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft: { hours?: number; minutes?: number; seconds?: number } = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  if (timeLeft.hours !== undefined) {
    timerComponents.push(
      <div key="hours" className="flex flex-col items-center">
        <span className="text-white text-5xl font-bold md:text-6xl lg:text-7xl">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className="text-[#2791A0] text-sm md:text-base">ЧАСА</span>
      </div>
    );
  }

  if (timeLeft.minutes !== undefined) {
    timerComponents.push(
      <span
        key="colon1"
        className="text-[#2791A0] text-5xl font-bold md:text-6xl lg:text-7xl mx-2 md:mx-4"
      >
        :
      </span>,
      <div key="minutes" className="flex flex-col items-center">
        <span className="text-white text-5xl font-bold md:text-6xl lg:text-7xl">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="text-[#2791A0] text-sm md:text-base">МИНУТ</span>
      </div>
    );
  }

  if (timeLeft.seconds !== undefined) {
    timerComponents.push(
      <span
        key="colon2"
        className="text-[#2791A0] text-5xl font-bold md:text-6xl lg:text-7xl mx-2 md:mx-4"
      >
        :
      </span>,
      <div key="seconds" className="flex flex-col items-center">
        <span className="text-white text-5xl font-bold md:text-6xl lg:text-7xl">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className="text-[#2791A0] text-sm md:text-base">СЕКУНД</span>
      </div>
    );
  }

  return (
    <div className="w-full px-[34px] pb-[20px] pt-[10px] rounded-xl bg-[#03243E] border-[1px]  border-[#1D738F]">
      <h2 className="text-[#2791A0] text-center text-[17px] font-bold mb-6">
        Открытие через
      </h2>
      <div className="flex justify-center items-baseline">
        {timerComponents.length ? (
          timerComponents
        ) : (
          <span className="text-white text-2xl">Время вышло!</span>
        )}
      </div>
    </div>
  );
}
