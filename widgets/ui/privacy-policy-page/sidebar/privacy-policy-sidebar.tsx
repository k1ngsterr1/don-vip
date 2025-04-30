import { FileText } from "lucide-react";
import Link from "next/link";

export function PrivacyPolicySidebar() {
  const sections = [
    { id: "section1", number: 1, title: "Общие положения", isActive: true },
    {
      id: "section2",
      number: 2,
      title: "Цели обработки информации",
      isActive: false,
    },
    {
      id: "section3",
      number: 3,
      title: "Условия обработки информации",
      isActive: false,
    },
    {
      id: "section4",
      number: 4,
      title: "Обязательства сторон",
      isActive: false,
    },
    {
      id: "section5",
      number: 5,
      title: "Ответственность сторон",
      isActive: false,
    },
    { id: "section6", number: 6, title: "Разрешение споров", isActive: false },
    {
      id: "section7",
      number: 7,
      title: "Дополнительные условия",
      isActive: false,
    },
  ];

  const relatedDocuments = [
    { title: "Публичная оферта", href: "/public-offer" },
    { title: "Пользовательское соглашение", href: "/terms" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
      <h2 className="font-medium text-lg mb-4 text-gray-800">Содержание</h2>
      <ul className="space-y-3">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`${
                section.isActive
                  ? "text-blue hover:underline"
                  : "text-gray-700 hover:text-blue transition-colors"
              } flex items-center`}
            >
              <span
                className={`w-6 h-6 rounded-full ${
                  section.isActive
                    ? "bg-blue-50 text-blue"
                    : "bg-gray-100 text-gray-700"
                } flex items-center justify-center mr-2 text-xs`}
              >
                {section.number}
              </span>
              {section.title}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center text-gray-500 mb-3">
          <FileText size={16} className="mr-2" />
          <span className="text-sm">Документы</span>
        </div>
        <ul className="space-y-2">
          {relatedDocuments.map((doc) => (
            <li key={doc.href}>
              <Link
                href={doc.href}
                className="text-sm text-gray-700 hover:text-blue transition-colors"
              >
                {doc.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
