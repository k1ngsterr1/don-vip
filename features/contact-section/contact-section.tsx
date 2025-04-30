import { Lock } from "lucide-react";

interface ContactSectionProps {
  email: string;
}

export function ContactSection({ email }: ContactSectionProps) {
  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
            <Lock className="text-blue w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Остались вопросы?</h3>
            <p className="text-gray-500">
              Свяжитесь с нами по электронной почте
            </p>
          </div>
        </div>
        <a
          href={`mailto:${email}`}
          className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {email}
        </a>
      </div>
    </div>
  );
}
