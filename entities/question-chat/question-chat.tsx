"use client";

import { MessageCircleQuestionIcon } from "lucide-react";
import React from "react";

interface IQuestionChat {
  isQuestionChat: boolean;
}

export const QuestionChat: React.FC<IQuestionChat> = ({ isQuestionChat }) => {
  return (
    <>
      {isQuestionChat && (
        <button className="bg-blue fixed bottom-[90px] md:bottom-[16px] right-[16px] rounded-full w-[64px] h-[64px] text-white flex items-center justify-center">
          <MessageCircleQuestionIcon
            className="text-white"
            width={26}
            height={26}
          />
        </button>
      )}
    </>
  );
};
