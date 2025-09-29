import { useState } from 'react';

export default function Book({ book, onBookClick, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onBookClick(book);
  };

  const bookSize = book.size || { width: 8, height: 26 };
  
  const sizeClasses = {
    width: {
      7: isMobile ? 'w-6' : 'w-7',
      8: isMobile ? 'w-7' : 'w-8', 
      9: isMobile ? 'w-8' : 'w-9'
    },
    height: {
      24: isMobile ? 'h-20' : 'h-24',
      26: isMobile ? 'h-22' : 'h-26',
      28: isMobile ? 'h-24' : 'h-28'
    }
  };

  const widthClass = sizeClasses.width[bookSize.width] || (isMobile ? 'w-7' : 'w-8');
  const heightClass = sizeClasses.height[bookSize.height] || (isMobile ? 'h-22' : 'h-26');

  return (
    <div
      className={`absolute rounded-xs bottom-2 border border-1 cursor-pointer transition-all duration-300 flex items-center justify-center overflow-hidden shadow-lg shadow-black-900/30 ${widthClass} ${heightClass}`}
      style={{
        left: `${book.position}%`,
        transform: `rotate(${book.rotation}deg) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
        backgroundColor: `#${book.colorHue || '4A90E2'}`,
        zIndex: isHovered ? 20 : 10 + Math.abs(book.rotation),
        backgroundImage: `url('/textures/book-texture.png')`,
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
      }}
      title={book.title}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        <span className={`text-center font-bold text-white text-wrap rotate-90 transform origin-center ${
          isMobile ? 'text-2xs' : 'text-xs'
        }`}
          style={{ fontSize: isMobile ? '8px' : '10px' }}
        >
          {book.title}
        </span>
        <div className="h-4 w-full bg-black opacity-20 absolute bottom-0"></div>
    </div>
  );
}