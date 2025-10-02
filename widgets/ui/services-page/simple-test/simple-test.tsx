"use client";

export const SimpleTest = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Дизайн Услуги</h1>
      <p className="text-gray-600 mb-8">Тестовая страница работает!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Дизайн Логотипа</h3>
          <p className="text-gray-600 mb-4">Создание уникального логотипа</p>
          <p className="text-2xl font-bold text-blue-600">1500 ₽</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Фирменный Стиль</h3>
          <p className="text-gray-600 mb-4">Полный пакет фирменного стиля</p>
          <p className="text-2xl font-bold text-blue-600">3000 ₽</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Дизайн Сайта</h3>
          <p className="text-gray-600 mb-4">Современный веб-дизайн</p>
          <p className="text-2xl font-bold text-blue-600">2500 ₽</p>
        </div>
      </div>
    </div>
  );
};
