import { useState, useEffect } from 'react';
import { getBooks, getGenres } from '../services/booksService';
import BookCard from '../components/CollectionScreen/BookCard';
import TypewriterSearch from '../components/CollectionScreen/TypewriterSearch';
import quetionMark from '/textures/question-mark.png';
import trashbinTexture from '/textures/trashbin-texture.png';
import noteTextureClose from '/textures/note-texture-close.png';
import noteTextureOpen from '/textures/note-texture-open.png';
import paperPeaceTexture from '/textures/paper-peace.png';
import cardTexture from '/textures/card-texture.png';
import cardTextureBack from '/textures/card-texture-back.png';
import {Tape} from '../components/Decor.jsx';

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
  const [currentGenrePage, setCurrentGenrePage] = useState(0);
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

    result = sortBooks(result);
    setFilteredBooks(result);
    setCurrentPage(1);
  }, [allBooks, searchTerm, selectedGenres, titleSort, authorSort]);

  const sortBooks = (books) => {
    return [...books].sort((a, b) => {
      if (titleSort !== 'none') {
        const aTitle = (a.title || '').toLowerCase();
        const bTitle = (b.title || '').toLowerCase();
        if (aTitle !== bTitle) {
          return titleSort === 'asc' 
            ? aTitle.localeCompare(bTitle)
            : bTitle.localeCompare(aTitle);
        }
      }

      if (authorSort !== 'none') {
        const aAuthor = (a.author || '').toLowerCase();
        const bAuthor = (b.author || '').toLowerCase();
        if (aAuthor !== bAuthor) {
          return authorSort === 'asc'
            ? aAuthor.localeCompare(bAuthor)
            : bAuthor.localeCompare(aAuthor);
        }
      }

      return 0;
    });
  };

  // page pagination - Books
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // page pagination - Genres
  const itemsPerGenrePage = 6;
  const totalGenrePages = Math.ceil(genres.length / itemsPerGenrePage);

  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setTrashbinActive(true);
    setTimeout(() => {
    setSearchTerm('');
    setSelectedGenres([]);
    setTitleSort('asc');
    setAuthorSort('none');
    setCurrentGenrePage(0);
    setTrashbinActive(false);
    }, 500);
  };

  const toggleTitleSort = () => {
    setTitleSort(prev => prev === 'asc' ? 'desc' : 'asc');
    setAuthorSort('none');
  };

  const toggleAuthorSort = () => {
    setAuthorSort(prev => prev === 'asc' ? 'desc' : 'asc');
    setTitleSort('none');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-stone-600 mx-auto mb-6"></div>
          <div className="courier-prime-bold text-stone-800 text-xl">Завантаження колекції...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-col lg:flex-row items-center border-b-4 border-stone-400 mb-10">
          {/* Панель пошуку */}
          <div className="flex-1 md:w-1/2 flex justify-center mb-8">
            <TypewriterSearch
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Пошук за назвою, автором, описом..."
            />
          </div>

          <div className="md:w-1/2 flex flex-col items-center mb-8">
            
            {/* Інформація про результати */}
            <div className="relative w-100 h-20 mb-6">
              <div className="courier-prime h-35 text-gray-800 text-lg p-4 text-center"
                style={{
                  backgroundImage: `url(${paperPeaceTexture})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'top',
                }}
              >
                Знайдено книг: <span className="font-bold">{filteredBooks.length}</span> | 
                Сторінка: <span className="font-bold">{currentPage}</span> з <span className="font-bold">{totalPages}</span>
              </div>
              <Tape degree={35} size={60} top={-20} right={-10} />
            </div>
            
            <div className="flex gap-5 justify-center items-end mb-6">
              {/* Корзина */}
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
                <div className="relative max-w-4xl mx-4">
                  <div className="relative flex justify-center w-110 h-70">
                    <img 
                      src={noteTextureOpen} 
                      alt="Фільтри" 
                      className="h-85 center cursor-pointer"
                    />
                    <div className="absolute inset-0 items-center px-12 py-5">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="absolute top-4 right-4 w-4 h-4 bg-stone-500 text-white rounded-full flex items-center justify-center hover:bg-stone-600 transition-colors z-10"
                      >×</button>
                      
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
                                    <label key={genre.id} className="flex items-center space-x-3 cursor-pointer group py-1">
                                      <input
                                        type="checkbox"
                                        checked={selectedGenres.includes(genre.id)}
                                        onChange={() => handleGenreToggle(genre.id)}
                                        className="hidden"
                                      />
                                      <div className={`relative w-5 h-5 border-2 rounded transition-all duration-200 group-hover:scale-110 ${
                                        selectedGenres.includes(genre.id)
                                          ? 'bg-stone-600 border-stone-700 shadow-lg'
                                          : 'bg-white border-stone-300 group-hover:border-stone-500'
                                      }`}>
                                        {selectedGenres.includes(genre.id) && (
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
                      
                      {/*  pages */}
                      <div className="absolute bottom-10 right-0 left-0 flex justify-center items-center px-6">
                        <div className="flex items-center justify-center space-x-4">
                          <button 
                            onClick={() => setCurrentGenrePage(prev => Math.max(prev - 1, 0))}
                            disabled={currentGenrePage === 0}
                            className={`pacifico-regular transition-colors text-sm ${
                              currentGenrePage === 0 
                                ? 'text-stone-500 line-through cursor-not-allowed' 
                                : 'text-stone-600 hover:text-stone-800'
                            }`}
                          >
                            ← Попередня
                          </button>
                          <span className="pacifico-regular bg-stone-400 rounded-md p-1 text-stone-700 text-sm">
                            {currentGenrePage + 1}/{totalGenrePages}
                          </span>
                          <button 
                            onClick={() => setCurrentGenrePage(prev => Math.min(prev + 1, totalGenrePages - 1))}
                            disabled={currentGenrePage >= totalGenrePages - 1}
                            className={`pacifico-regular transition-colors text-sm ${
                              currentGenrePage >= totalGenrePages - 1
                                ? 'text-stone-500 line-through cursor-not-allowed' 
                                : 'text-stone-600 hover:text-stone-800'
                            }`}
                          >
                            Наступна →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setShowFilters(true); setCurrentGenrePage(0); }}
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

          {/* Sorting */}
          <div className="flex flex-col gap-4 justify-center mb-8">
            {/* Title */}
            <button
              onClick={toggleTitleSort}
              className="px-4 py-2 cursor-pointer transition-all duration-200 courier-prime-bold"
            >
              <div className="text-center flex flex-col items-center">
                <div className="text-lg font-bold">Назва</div>
                <div 
                  className={`w-20 h-30 flex justify-center items-center transition-transform duration-500 ${titleSort === 'desc' ? 'rotate-360' : ''}`}
                  style={{
                    backgroundImage: `url(${titleSort === 'none' ? cardTextureBack : cardTexture})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center', 
                  }}
                >
                  <div 
                    className="text-stone-600 text-xl font-semibold"
                    style={{ 
                      writingMode: 'vertical-rl',
                      textOrientation: 'upright'
                    }}
                  >
                    {titleSort === 'asc' ? 'А ⇓ Я' : titleSort === 'desc' ? 'Я ⇓ А' : ''}
                  </div>
                </div>
              </div>
            </button>
            
            {/* Author */}
            <button
              onClick={toggleAuthorSort}
              className="px-4 py-2 cursor-pointer transition-all duration-200 courier-prime-bold"
            >
              <div className="text-center flex flex-col items-center">
                <div className="text-lg font-bold">Автор</div>
                <div
                  className={`w-20 h-30 flex justify-center items-center transition-transform duration-500 ${authorSort === 'desc' ? 'rotate-360' : ''}`}
                  style={{
                    backgroundImage: `url(${authorSort === 'none' ? cardTextureBack : cardTexture})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center', 
                  }}
                >
                  <div 
                    className="text-stone-600 text-xl font-semibold"
                    style={{ 
                      writingMode: 'vertical-rl',
                      textOrientation: 'upright'
                    }}
                  >
                    {authorSort === 'asc' ? 'А ⇓ Я' : authorSort === 'desc' ? 'Я ⇓ А' : ''}
                  </div>
                </div>
              </div>
            </button>
          </div>

        </div>

        {/* Результати пошуку */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center mb-6 h-32">
              <img src={quetionMark} alt="Not found" className="h-full opacity-80" />
            </div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-3">Книги не знайдено</h3>
            <p className="text-stone-700 mb-6 text-lg">Спробуйте змінити критерії пошуку або фільтри</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
              {currentBooks.map((book, index) => (
                <div 
                  key={book.id}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <BookCard
                    book={book}
                    onClick={() => onBookClick(book)}
                    genres={genres}
                  />
                </div>
              ))}
            </div>

            {/* Page pagination - Books */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 courier-prime-bold mb-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-3 border-2 border-stone-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 transition-all duration-200"
                >
                  ← Попередня
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    if (pageNum > totalPages || pageNum < 1) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-stone-600 text-white border-stone-700 shadow-lg'
                            : 'border-stone-300 hover:bg-stone-100 hover:border-stone-500'
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
                  className="px-5 py-3 border-2 border-stone-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 transition-all duration-200"
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