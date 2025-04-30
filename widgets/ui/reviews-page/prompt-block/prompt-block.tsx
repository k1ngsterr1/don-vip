import { MessageSquare } from "lucide-react";

export function FeedbackPrompt() {
  // Mobile version (unchanged)
  const mobilePrompt = (
    <div className="bg-gray-50 p-[24px] rounded-md my-4 md:hidden">
      <p className="text-dark text-[11px] font-roboto">
        Для нас крайне важно мнение наших клиентов! Мы постоянно стремимся
        улучшать качество и ваш опыт использования нашего магазина. Поэтому
        будем очень благодарны, если вы поделитесь своим отзывом с другими
        пользователями! 😊
      </p>
    </div>
  );

  // Desktop/Tablet version
  const desktopPrompt = (
    <div className="hidden md:block bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 lg:p-8">
      <div className="flex items-start lg:items-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 shadow-sm">
          <MessageSquare className="text-blue" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg lg:text-xl font-medium text-gray-800 mb-2">
            Ваше мнение важно для нас!
          </h3>
          <p className="text-gray-700 lg:text-base">
            Мы постоянно стремимся улучшать качество и ваш опыт использования
            нашего магазина. Будем очень благодарны, если вы поделитесь своим
            отзывом с другими пользователями! 😊
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobilePrompt}
      {desktopPrompt}
    </>
  );
}
