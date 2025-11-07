"use client";

import { useLocale } from "next-intl";

export function TelegramBotInstruction() {
  const locale = useLocale();

  const content = {
    ru: {
      title: "📱 Как использовать Telegram бота для проверки подписки",
      steps: [
        {
          number: "1",
          title: "Подпишитесь на канал",
          description:
            "Перейдите в Telegram канал @DON_VIPCOM и нажмите «Подписаться»",
          icon: "📢",
        },
        {
          number: "2",
          title: "Найдите бота",
          description:
            "Откройте бота в Telegram (имя бота будет указано после создания)",
          icon: "🤖",
        },
        {
          number: "3",
          title: "Запустите бота",
          description:
            "Отправьте команду /start боту. Бот автоматически проверит вашу подписку на канал",
          icon: "▶️",
        },
        {
          number: "4",
          title: "Получите подтверждение",
          description: "Бот сообщит вам, подписаны ли вы на канал или нет",
          icon: "✅",
        },
        {
          number: "5",
          title: "Введите username здесь",
          description:
            "Вернитесь на сайт и введите ваш Telegram username (без @) в поле выше",
          icon: "⌨️",
        },
      ],
      notes: [
        "💡 Убедитесь, что ваш профиль Telegram не скрыт от поиска",
        "💡 Username должен быть указан в настройках вашего Telegram профиля",
        "💡 После подписки может потребоваться несколько секунд для обновления статуса",
      ],
      channelLink: "Перейти в канал",
      botLink: "Открыть бота",
    },
    en: {
      title: "📱 How to use Telegram bot to verify subscription",
      steps: [
        {
          number: "1",
          title: "Subscribe to channel",
          description:
            "Go to Telegram channel @DON_VIPCOM and click «Subscribe»",
          icon: "📢",
        },
        {
          number: "2",
          title: "Find the bot",
          description:
            "Open the bot in Telegram (bot name will be provided after creation)",
          icon: "🤖",
        },
        {
          number: "3",
          title: "Start the bot",
          description:
            "Send /start command to the bot. Bot will automatically check your channel subscription",
          icon: "▶️",
        },
        {
          number: "4",
          title: "Get confirmation",
          description:
            "Bot will inform you whether you are subscribed to the channel or not",
          icon: "✅",
        },
        {
          number: "5",
          title: "Enter username here",
          description:
            "Return to the website and enter your Telegram username (without @) in the field above",
          icon: "⌨️",
        },
      ],
      notes: [
        "💡 Make sure your Telegram profile is not hidden from search",
        "💡 Username must be set in your Telegram profile settings",
        "💡 After subscription, it may take a few seconds to update the status",
      ],
      channelLink: "Go to channel",
      botLink: "Open bot",
    },
  };

  const t = content[locale as keyof typeof content] || content.ru;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 space-y-6">
      {/* Title */}
      <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
        {t.title}
      </h3>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <a
          href="https://t.me/DON_VIPCOM"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[140px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center transition-colors flex items-center justify-center gap-2"
        >
          <span>📢</span>
          <span>{t.channelLink}</span>
        </a>
        {/* Раскомментируйте когда узнаете точное имя бота
        <a
          href="https://t.me/YOUR_BOT_USERNAME"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[140px] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-center transition-colors flex items-center justify-center gap-2"
        >
          <span>🤖</span>
          <span>{t.botLink}</span>
        </a>
        */}
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {t.steps.map((step) => (
          <div
            key={step.number}
            className="flex gap-4 p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                {step.number}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{step.icon}</span>
                <h4 className="font-semibold text-gray-900">{step.title}</h4>
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="space-y-2 pt-4 border-t border-blue-200">
        {t.notes.map((note, index) => (
          <p key={index} className="text-sm text-blue-700">
            {note}
          </p>
        ))}
      </div>
    </div>
  );
}
