import { useState } from 'react';
import noteTextureOpen from '/textures/note-texture-open.png';

export default function GenreNotebook({
  onClose,
  genres,
  selectedGenres,
  onGenreToggle,
  currentGenrePage,
  totalGenrePages,
  onGenrePageChange
}) {
  const itemsPerGenrePage = 6;

  return (
    <div className="relative max-w-4xl mx-4">
      <div className="relative flex justify-center w-110 h-70">
        <img 
          src={noteTextureOpen} 
          alt="Фільтри" 
          className="h-85 center cursor-pointer"
        />
        <div className="absolute inset-0 items-center px-12 py-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-4 h-4 bg-stone-500 text-white rounded-full flex items-center justify-center hover:bg-stone-600 transition-colors z-10"
          >
            ×
          </button>
          
          <div className="relative h-4/5">
            <div className="flex h-full">
              {[0, 1].map(pageOffset => {
                const actualPage = currentGenrePage + pageOffset;
                const startIndex = actualPage * itemsPerGenrePage;
                const endIndex = startIndex + itemsPerGenrePage;
                const pageGenres = genres.slice(startIndex, endIndex);
                
                if (startIndex >= genres.length) {
                  return (
                    <div key={actualPage} className="flex-1 min-w-0">
                      <div className="grid grid-cols-1 gap-2 h-full">
                        {Array.from({ length: itemsPerGenrePage }).map((_, index) => (
                          <div key={`empty-${index}`} className="h-6 opacity-0">●</div>
                        ))}
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div key={actualPage} className="flex-1 min-w-0">
                    <div className="grid grid-cols-1 gap-2 h-full">
                      {pageGenres.map(genre => (
                        <GenreCheckbox
                          key={genre.id}
                          genre={genre}
                          isSelected={selectedGenres.includes(genre.id)}
                          onToggle={() => onGenreToggle(genre.id)}
                        />
                      ))}
                      
                      {pageGenres.length < itemsPerGenrePage && 
                        Array.from({ length: itemsPerGenrePage - pageGenres.length }).map((_, index) => (
                          <div key={`empty-${actualPage}-${index}`} className="h-6 opacity-0">●</div>
                        ))
                      }
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-stone-400 transform -translate-x-1/2"></div>
          </div>
          
          <GenrePagination
            currentPage={currentGenrePage}
            totalPages={totalGenrePages}
            onPageChange={onGenrePageChange}
          />
        </div>
      </div>
    </div>
  );
}

function GenreCheckbox({ genre, isSelected, onToggle }) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group py-1">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="hidden"
      />
      <div className={`relative w-5 h-5 border-2 rounded transition-all duration-200 group-hover:scale-110 ${
        isSelected
          ? 'bg-stone-600 border-stone-700 shadow-lg'
          : 'bg-white border-stone-300 group-hover:border-stone-500'
      }`}>
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      <span className="pacifico-regular text-stone-800 group-hover:text-stone-900 transition-colors text-sm">
        {genre.name}
      </span>
    </label>
  );
}

function GenrePagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="absolute bottom-10 right-0 left-0 flex justify-center items-center px-6">
      <div className="flex items-center justify-center space-x-4">
        <button 
          onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
          disabled={currentPage === 0}
          className={`pacifico-regular transition-colors text-sm ${
            currentPage === 0 
              ? 'text-stone-500 line-through cursor-not-allowed' 
              : 'text-stone-600 hover:text-stone-800'
          }`}
        >
          ← Попередня
        </button>
        <span className="pacifico-regular bg-stone-400 rounded-md p-1 text-stone-700 text-sm">
          {currentPage + 1}/{totalPages}
        </span>
        <button 
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
          disabled={currentPage >= totalPages - 1}
          className={`pacifico-regular transition-colors text-sm ${
            currentPage >= totalPages - 1
              ? 'text-stone-500 line-through cursor-not-allowed' 
              : 'text-stone-600 hover:text-stone-800'
          }`}
        >
          Наступна →
        </button>
      </div>
    </div>
  );
}