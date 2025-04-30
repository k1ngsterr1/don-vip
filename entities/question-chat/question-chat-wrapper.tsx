"use client";

import { usePathname } from "next/navigation";
import { QuestionChat } from "./question-chat";

export default function QuestionChatWrapper() {
  const pathname = usePathname();

  const hideQuestionButton = [
    "/faq",
    "/privacy-policy",
    "/terms",
    "/offer",
    "/reviews",
    "/send-review",
    "/auth/register",
    "/auth/login",
    "/auth/forgot-password",
    "/contact",
    "/coupons+",
    "/order/test",
    "/order+",
  ];

  const isProfilePath = pathname.startsWith("/profile");

  const isQuestionChat = !(
    hideQuestionButton.includes(pathname) || isProfilePath
  );

  return <QuestionChat isQuestionChat={isQuestionChat} />;
}
