import { useState, useEffect } from 'react';
import { getBooks, getGenres } from '../services/booksService';
import BookCard from '../components/BookCard';
import TypewriterSearch from '../components/TypewriterSearch.jsx';
import quetionMark from '/textures/question-mark.png';
import trashbinTexture from '/textures/trashbin-texture.png';
import noteTextureClose from '/textures/note-texture-close.png';
import noteTextureOpen from '/textures/note-texture-open.png';
import paperPeaceTexture from '/textures/paper-peace.png';

export default function CollectionScreen({ onBookClick }) {
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [titleSort, setTitleSort] = useState('asc');
  const [authorSort, setAuthorSort] = useState('none');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [trashbinActive, setTrashbinActive] = useState(false);

  // Завантаження даних
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [booksData, genresData] = await Promise.all([
        getBooks(),
        getGenres()
      ]);
      
      setAllBooks(booksData);
      setFilteredBooks(booksData);
      setGenres(genresData);
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
    } finally {
      setLoading(false);
    }
  };

  // Фільтрація та пошук
  useEffect(() => {
    let result = allBooks;

    // Пошук по тексту
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(book => 
        book.title?.toLowerCase().includes(term) ||
        book.author?.toLowerCase().includes(term) ||
        book.description?.toLowerCase().includes(term)
      );
    }

    // Фільтрація по жанрам
    if (selectedGenres.length > 0) {
      result = result.filter(book => 
        book.genres?.some(genre => selectedGenres.includes(genre))
      );
    }

    // Сортування
    result = sortBooks(result, sortBy, sortOrder);

    setFilteredBooks(result);
    setCurrentPage(1); // Скидаємо на першу сторінку при зміні фільтрів
  }, [allBooks, searchTerm, selectedGenres, sortBy, sortOrder]);

  // Функція сортування
  const sortBooks = (books, field, order) => {
    return [...books].sort((a, b) => {
      let aValue = a[field] || '';
      let bValue = b[field] || '';

      // Для числових полів
      if (field === 'year' || field === 'pages') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }

      // Для текстових полів
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  // Пагінація
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenres([]);
    setSortBy('title');
    setSortOrder('asc');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-6"></div>
          <div className="courier-prime-bold text-stone-800 text-xl">Завантаження колекції...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-col lg:flex-row ">
          {/* Панель пошуку */}
          <div className="flex-1 md:w-1/2 flex justify-center mb-8">
            <TypewriterSearch
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Пошук за назвою, автором, описом..."
            />
          </div>

          <div className="md:w-1/2 mb-8">
            
            {/* Інформація про результати */}
            <div className="mb-6">
              <div className="courier-prime h-40 text-gray-800 text-lg p-4 text-center"
                style={{
                  backgroundImage: `url(${paperPeaceTexture})`,
                  backgroundSize: 'cover',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'top',
                }}
              >
                Знайдено книг: <span className="font-bold">{filteredBooks.length}</span> | 
                Сторінка: <span className="font-bold">{currentPage}</span> з <span className="font-bold">{totalPages}</span>
              </div>
            </div>

            {/* Кнопки управління */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                🎛️ Фільтри {showFilters ? '▲' : '▼'}
              </button>
              
              <button
                onClick={clearFilters}
                className={`relative transition-all duration-500 ${trashbinActive ? 'transform scale-110 rotate-12' : ''}`}
                disabled={trashbinActive}
              >
                <img 
                  src={trashbinTexture}
                  className="w-16 cursor-pointer hover:scale-110 transition-transform"
                />
              </button>

              {/* Блокнот фільтрів */}
              {showFilters ? (
                <div className="flex justify-center mb-8">
                  <div className="relative w-110 h-70"
                    style={{
                      backgroundImage: `url(${noteTextureOpen})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'top',
                    }}
                  >
                    <div className="absolute inset-0 items-center px-10 p-7">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="absolute top-4 right-4 w-4 h-4 bg-stone-500 text-white rounded-full flex items-center justify-center hover:bg-stone-600 transition-colors z-10"
                      >×</button>
                      
                      <div className="relative h-5/6">
                        <div className="flex space-x-6 h-full">
                          {[0, 1].map(pageIndex => {
                            const itemsPerPage = 6;
                            const startIndex = pageIndex * itemsPerPage;
                            const endIndex = startIndex + itemsPerPage;
                            const pageGenres = genres.slice(startIndex, endIndex);
                            
                            return (
                              <div key={pageIndex} className="flex-1 min-w-0">
                                <div className="grid grid-cols-1 gap-2 h-full">
                                  {pageGenres.map(genre => (
                                    <label key={genre.id} className="flex items-center space-x-3 cursor-pointer group py-1">
                                      <input
                                        type="checkbox"
                                        checked={selectedGenres.includes(genre.id)}
                                        onChange={() => handleGenreToggle(genre.id)}
                                        className="hidden"
                                      />
                                      <div className={`relative w-5 h-5 border-2 rounded transition-all duration-200 group-hover:scale-110 ${
                                        selectedGenres.includes(genre.id)
                                          ? 'bg-amber-600 border-amber-700 shadow-lg'
                                          : 'bg-white border-amber-300 group-hover:border-amber-500'
                                      }`}>
                                        {selectedGenres.includes(genre.id) && (
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                      <span className="pacifico-regular text-amber-800 group-hover:text-amber-900 transition-colors text-sm">
                                        {genre.name}
                                      </span>
                                    </label>
                                  ))}
                                  
                                  {/* Пусті рядки для вирівнювання */}
                                  {pageGenres.length < itemsPerPage && 
                                    Array.from({ length: itemsPerPage - pageGenres.length }).map((_, index) => (
                                      <div key={`empty-${pageIndex}-${index}`} className="h-6 opacity-0">
                                        ●
                                      </div>
                                    ))
                                  }
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-amber-400 transform -translate-x-1/2"></div>
                      </div>
                      
                      <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-6">
                        
                        <div className="flex items-center justify-center space-x-4">
                          <button className="pacifico-regular text-amber-600 hover:text-amber-800 transition-colors text-sm">
                            ← Попередня
                          </button>
                          <span className="pacifico-regular text-amber-700 text-sm">
                            1/{Math.ceil(genres.length / 8)}
                          </span>
                          <button className="pacifico-regular text-amber-600 hover:text-amber-800 transition-colors text-sm">
                            Наступна →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowFilters(true)}
                  className="relative transition-transform hover:scale-105"
                >
                  <img 
                    src={noteTextureClose} 
                    alt="Фільтри" 
                    className="h-40 cursor-pointer"
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full text-white text-xs flex items-center justify-center">
                    {selectedGenres.length}
                  </div>
                </button>
              )}

            </div>
          </div>

          {/* Розширені фільтри */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">Фільтри за жанрами:</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreToggle(genre.id)}
                    className={`px-3 py-1 rounded-full border transition-colors ${
                      selectedGenres.includes(genre.id)
                        ? 'bg-stone-500 text-white '
                        : 'bg-white text-gray-700 border-gray-300 hover:border-stone-900'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Результати пошуку */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center mb-6 h-32">
              <img src={quetionMark} alt="Not found" className="h-full opacity-80" />
            </div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-3">Книги не знайдено</h3>
            <p className="text-amber-700 mb-6 text-lg">Спробуйте змінити критерії пошуку або фільтри</p>
            <button
              onClick={clearFilters}
              className="bg-stone-600 hover:bg-stone-500 text-white px-8 py-3 rounded-lg transition-all cursor-pointer duration-200 hover:shadow-lg"
            >
              Показати всі книги
            </button>
          </div>
        ) : (
          <>
            {/* Сітка книг */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => onBookClick(book)}
                  genres={genres}
                />
              ))}
            </div>

            {/* Пагінація */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ← Попередня
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-amber-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Наступна →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}