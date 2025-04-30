"use client";

import { HelpCircle } from "lucide-react";
import Image from "next/image";

interface UserIdFormProps {
  requiresServer: boolean;
  userId: string;
  serverId: string;
  agreeToTerms: boolean;
  onUserIdChange: (value: string) => void;
  onServerIdChange: (value: string) => void;
  onAgreeChange: (value: boolean) => void;
}

export function UserIdForm({
  requiresServer,
  userId,
  serverId,
  agreeToTerms,
  onUserIdChange,
  onServerIdChange,
  onAgreeChange,
}: UserIdFormProps) {
  return (
    <div className="px-4 mb-6">
      <div className="flex items-center mb-4">
        <h2 className="text-dark font-roboto font-medium">
          2 ВВЕДИТЕ ВАШ ID {requiresServer ? "И СЕРВЕР" : "(НЕ ВВОДИТЕ «ID:»)"}
        </h2>
        <HelpCircle size={16} className="ml-2 text-gray-400" />
      </div>

      <div className="space-y-3">
        {!requiresServer && (
          <div className="relative">
            <div className="absolute left-3 font-roboto font-black text-black text-[13px] top-1/2 transform -translate-y-1/2  text-sm">
              ID:
            </div>
            <input
              type="text"
              placeholder="USER ID"
              value={userId}
              onChange={(e) => onUserIdChange(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-200 rounded-lg"
            />
          </div>
        )}
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreeToTerms}
            onChange={() => onAgreeChange(!agreeToTerms)}
            className=" mr-2 h-4 w-4 accent-blue-500"
          />
          <label htmlFor="terms" className="text-[11px] text-gray-600">
            Я подтверждаю правильность ввода данных
          </label>
        </div>
        {requiresServer ? (
          <>
            <input
              type="text"
              placeholder="USER ID"
              value={userId}
              onChange={(e) => onUserIdChange(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                (
              </div>
              <input
                type="text"
                placeholder="USER SERVER"
                value={serverId}
                onChange={(e) => onServerIdChange(e.target.value)}
                className="w-full p-3 px-8 border border-gray-200 rounded-lg text-center"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                )
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-4 mb-2">
              <h3 className="font-medium text-[16px] font-bold font-condensed mb-2">
                ГДЕ НАЙТИ Bigo Live ID?
              </h3>
              <ol className="text-[15px] font-condensed text-gray-600 space-y-1 list-decimal pl-5">
                <li className="text-black text-[17px]">
                  Войдите в приложение Bigo Live
                </li>
                <li className="text-black font-condensed text-[17px]">
                  Перейдите на страницу Я
                </li>
                <li className="text-black font-condensed text-[17px]">
                  Под вашим ником отобразится Bigo Live ID
                </li>
                <li className="text-black font-condensed text-[17px]">
                  Скопируйте и введите цифры на сайте
                </li>
              </ol>
            </div>
            <Image
              src="/check.webp"
              width={250}
              height={46}
              className="w-[250px] h-[46px]"
              alt="Check"
            />
          </>
        )}
      </div>
    </div>
  );
}
