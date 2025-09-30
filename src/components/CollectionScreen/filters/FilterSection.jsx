import ResultsInfo from '../ResultInfo';
import GenreNotebook from './GenreNotebook';

import trashbinTexture from '/textures/trashbin-texture.png';
import noteTextureClose from '/textures/note-texture-close.png';

export default function FiltersSection({
  filteredBooks,
  currentPage,
  totalPages,
  trashbinActive,
  onClearFilters,
  showFilters,
  onShowFiltersChange,
  selectedGenres,
  genres,
  currentGenrePage,
  totalGenrePages,
  onGenrePageChange,
  onGenreToggle,
  isMobile
}) {
  if (isMobile) {
    return (
      <div className="w-full">
        
        <div className="flex gap-4 justify-center items-center mb-4">
          {/* Корзина */}
          <button
            onClick={onClearFilters}
            className={`relative transition-all duration-500 ${trashbinActive ? 'transform scale-110 rotate-12' : ''}`}
            disabled={trashbinActive}
          >
            <img 
              src={trashbinTexture}
              className="w-12 cursor-pointer hover:scale-110 transition-transform"
              alt="Очистити фільтри"
            />
          </button>

          {/* Блокнот фільтрів */}
          {showFilters ? (
            <GenreNotebook
              onClose={() => onShowFiltersChange(false)}
              genres={genres}
              selectedGenres={selectedGenres}
              onGenreToggle={onGenreToggle}
              currentGenrePage={currentGenrePage}
              totalGenrePages={totalGenrePages}
              onGenrePageChange={onGenrePageChange}
              isMobile={isMobile}
            />
          ) : (
            <button
              onClick={() => { 
                onShowFiltersChange(true); 
                onGenrePageChange(0); 
              }}
              className="relative transition-transform hover:scale-105"
            >
              <img 
                src={noteTextureClose} 
                alt="Фільтри" 
                className="h-16 cursor-pointer"
              />
              {selectedGenres.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-stone-500 rounded-full text-white text-xs flex items-center justify-center">
                  {selectedGenres.length}
                </div>
              )}
            </button>
          )}
        </div>
        <ResultsInfo 
          filteredBooks={filteredBooks}
          currentPage={currentPage}
          totalPages={totalPages}
          isMobile={isMobile}
        />  
      </div>
    );
  }

  return (
    <div className="md:w-1/2 flex flex-col items-center mb-8">
      <ResultsInfo 
        filteredBooks={filteredBooks}
        currentPage={currentPage}
        totalPages={totalPages}
        isMobile={isMobile}
      />
      
      <div className="flex gap-5 justify-center items-end mb-6">
        {/* Корзина */}
        <button
          onClick={onClearFilters}
          className={`relative transition-all duration-500 ${trashbinActive ? 'transform scale-110 rotate-12' : ''}`}
          disabled={trashbinActive}
        >
          <img 
            src={trashbinTexture}
            className="w-16 cursor-pointer hover:scale-110 transition-transform"
            alt="Очистити фільтри"
          />
        </button>

        {/* Блокнот фільтрів */}
        {showFilters ? (
          <GenreNotebook
            onClose={() => onShowFiltersChange(false)}
            genres={genres}
            selectedGenres={selectedGenres}
            onGenreToggle={onGenreToggle}
            currentGenrePage={currentGenrePage}
            totalGenrePages={totalGenrePages}
            onGenrePageChange={onGenrePageChange}
            isMobile={isMobile}
          />
        ) : (
          <button
            onClick={() => { 
              onShowFiltersChange(true); 
              onGenrePageChange(0); 
            }}
            className="relative transition-transform hover:scale-105"
          >
            <img 
              src={noteTextureClose} 
              alt="Фільтри" 
              className="h-70 cursor-pointer"
            />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-stone-500 rounded-full text-white text-xs flex items-center justify-center">
              {selectedGenres.length}
            </div>
          </button>
        )}
      </div>
    </div>
  );
}