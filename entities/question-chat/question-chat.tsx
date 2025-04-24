"use client";

import { MessageCircleQuestionIcon } from "lucide-react";
import React from "react";

export const QuestionChat = () => {
  return (
    <button className="bg-blue fixed bottom-[90px] right-[16px] rounded-full w-[64px] h-[64px] text-white flex items-center justify-center">
      <MessageCircleQuestionIcon
        className="text-white"
        width={26}
        height={26}
      />
    </button>
  );
};
