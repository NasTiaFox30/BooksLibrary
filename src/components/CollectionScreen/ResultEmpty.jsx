import quetionMark from '/textures/question-mark.png';

export default function EmptyState({ onClearFilters }) {
  return (
    <div className="text-center py-12">
      <div className="flex items-center justify-center mb-6 h-32">
        <img src={quetionMark} alt="Not found" className="h-full opacity-80" />
      </div>
      <h3 className="text-3xl font-semibold text-gray-700 mb-3">Книги не знайдено</h3>
      <p className="text-stone-700 mb-6 text-lg">Спробуйте змінити критерії пошуку або фільтри</p>
      <button
        onClick={onClearFilters}
        className="bg-stone-600 hover:bg-stone-500 text-white px-8 py-3 rounded-lg transition-all cursor-pointer duration-200 hover:shadow-lg"
      >
        Показати всі книги
      </button>
    </div>
  );
}