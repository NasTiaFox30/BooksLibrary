import quetionMark from '/textures/question-mark.png';

export default function EmptyState({ onClearFilters, isMobile }) {
  return (
    <div className="text-center py-8 md:py-12">
      <div className="flex items-center justify-center mb-4 md:mb-6 h-20 md:h-32">
        <img src={quetionMark} alt="Not found" className="h-full opacity-80" />
      </div>
      <h3 className="text-xl md:text-3xl font-semibold text-gray-700 mb-2 md:mb-3">Книги не знайдено</h3>
      <p className="text-stone-700 mb-4 md:mb-6 text-sm md:text-lg">Спробуйте змінити критерії пошуку або фільтри</p>
      <button
        onClick={onClearFilters}
        className="bg-stone-600 hover:bg-stone-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg transition-all cursor-pointer duration-200 hover:shadow-lg text-sm md:text-base"
      >
        Показати всі книги
      </button>
    </div>
  );
}