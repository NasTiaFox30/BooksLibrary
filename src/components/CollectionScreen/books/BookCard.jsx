import { useState } from 'react';
import bookIcon from '/textures/decor/decor10.png';
import calendarIcon from '/textures/decor/decor11.png';

export default function BookCard({ book, onBookClick, genres, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onBookClick(book);
  };

  // Отримуємо розміри книги
  const bookSize = book.size || { width: 8, height: 26 };
  
  // Адаптивні розміри для мобільних
  const cardWidth = isMobile ? bookSize.width * 6 : bookSize.width * 9;
  const cardHeight = isMobile ? bookSize.height * 4 : bookSize.height * 6;

  // Отримуємо назви жанрів
  const getGenreNames = (genreIds) => {
    if (!genreIds || !genres) return [];
    return genreIds.map(genreId => {
      const genre = genres.find(g => g.id === genreId);
      return genre ? genre.name : genreId;
    });
  };

  const genreNames = getGenreNames(book.genres);

  return (
    <div 
      className="relative group cursor-pointer transition-all duration-300"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Контейнер книги з тінню */}
      <div className="relative flex justify-center transition-transform duration-300 group-hover:scale-105">
        {/* Сама книга */}
        { !isHovered && book.imagePath && (
        <div
          className="relative rounded-xs border overflow-hidden shadow-lg"
          style={{
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            backgroundColor: `#${book.colorHue || '4A90E2'}`,
            backgroundImage: `url('/textures/book-texture.png')`,
            backgroundSize: 'cover',
            backgroundBlendMode: 'multiply',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Текст на книзі */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span 
              className="text-white font-bold whitespace-nowrap rotate-90 transform origin-center"
              style={{
                fontSize: `${Math.max(8, cardHeight * 0.1)}px`,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {book.title}
            </span>
          </div>

          {/* Нижня частина книги (підставка) */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-black opacity-20"
            style={{ height: `${cardHeight * 0.15}px` }}
          ></div>
          </div>
        )}
        {/* Ефект при наведенні */}
        {!isMobile && isHovered && book.imagePath && (
          <img
          src={book.imagePath}
          alt={book.title}
          className="relative group-hover:scale-105 transition-transform duration-300"
          style={{
            width: `auto`,
            height: `${cardHeight}px`,
          }}
          />
        )}

        {/* Тінь під книгою */}
        <div 
          className="absolute -bottom-2 h-2 bg-black opacity-10 rounded-lg blur-sm transition-all duration-300"
          style={{
            width: `${cardWidth * (isMobile ? 1.2 : 1.5)}px`,
            transform: `scale(${isHovered ? 1.1 : 0.9})`,
            opacity: isHovered ? 0.2 : 0.1
          }}
        ></div>
      </div>

      {/* Інформація під книгою */}
      <div className="mt-3 md:mt-4 text-center">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-amber-600 transition-colors text-sm md:text-base">
          {book.title}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 mb-2">by {book.author || 'Невідомо'}</p>
        
        {/* Жанри */}
        {genreNames.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mb-2">
            {genreNames.slice(0, isMobile ? 1 : 2).map((genre, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 rounded-full border border-1"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Додаткова інформація */}
        <div className="flex justify-center items-center gap-2 md:gap-3 text-xs text-gray-500">
          {book.year && (
            <span className="flex items-center gap-1">
              <img src={calendarIcon} alt="" className='w-6 md:w-8' /> 
              {book.year}
            </span>
          )}
          {book.pages && (
            <span className="flex items-center gap-1">
              <img src={bookIcon} alt="" className='w-6 md:w-8'/> 
              {book.pages} ст.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}