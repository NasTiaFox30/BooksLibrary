import { useState } from 'react';

export default function Book({ book, onBookClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onBookClick(book);
  };

  return (
    <div
      className="absolute bottom-2 h-24 w-8 border border-1 cursor-pointer transition-all duration-300 flex items-center justify-center overflow-hidden shadow-lg shadow-black-900/30"
      style={{
        left: `${book.position}%`,
        transform: `rotate(${book.rotation}deg) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
        backgroundColor: `#${book.colorHue || Math.random() * 360}`,
        zIndex: isHovered ? 20 : 10 + Math.abs(book.rotation)
      }}
      title={book.title}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center">
        <span className="text-xs font-bold text-white whitespace-nowrap rotate-90 transform origin-center mt-8">
          {book.title}
        </span>
        <div className="h-4 w-full bg-black opacity-20 absolute bottom-0"></div>
      </div>
    </div>
  );
}