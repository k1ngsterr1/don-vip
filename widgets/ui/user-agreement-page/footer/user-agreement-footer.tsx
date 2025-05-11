"use client";

export function UserAgreementContactFooter() {
  return (
    <div className="mt-10 pt-6 border-t border-gray-100">
      <p className="text-gray-600">
        Если у вас есть вопросы по настоящему Соглашению, вы можете связаться с
        нами через{" "}
        <a href="/contact" className="text-blue-600 hover:underline">
          контактную форму
        </a>{" "}
        на сайте.
      </p>
    </div>
  );
}
