import { useState, useEffect } from 'react';
import { getBooks, getGenres } from '../services/booksService';
import SearchSection from '../components/CollectionScreen/search/SerchSection';
import FiltersSection from '../components/CollectionScreen/filters/FilterSection';
import SortCards from '../components/CollectionScreen/filters/SortCards';
import BookGridSection from '../components/CollectionScreen/books/BookGridSection';
import LoadingState from '../components/LoadingState';
import ResultEmpty from '../components/CollectionScreen/ResultEmpty';

export default function CollectionScreen({ onBookClick, onGoBack, isMobile }) {
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
  const [booksPerPage] = useState(isMobile ? 8 : 12);
  const [showFilters, setShowFilters] = useState(false);
  const [trashbinActive, setTrashbinActive] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
      if (isMobile) setShowMobileFilters(false);
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

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-3 md:px-4">
        <div className={`flex flex-col lg:flex-row items-center border-b-2 md:border-b-4 border-stone-400 mb-6 md:mb-10 ${
          isMobile ? 'pb-4' : ''
        }`}>
          <SearchSection
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            isMobile={isMobile}
          />

          {/* Desktop */}
          {!isMobile && (
            <FiltersSection
              filteredBooks={filteredBooks}
              currentPage={currentPage}
              totalPages={totalPages}
              trashbinActive={trashbinActive}
              onClearFilters={clearFilters}
              showFilters={showFilters}
              onShowFiltersChange={setShowFilters}
              selectedGenres={selectedGenres}
              genres={genres}
              currentGenrePage={currentGenrePage}
              totalGenrePages={totalGenrePages}
              onGenrePageChange={setCurrentGenrePage}
              onGenreToggle={handleGenreToggle}
              isMobile={isMobile}
            />
          )}  
          {!isMobile && (
          <SortCards
            titleSort={titleSort}
            authorSort={authorSort}
            onTitleSortToggle={toggleTitleSort}
            onAuthorSortToggle={toggleAuthorSort}
            isMobile={isMobile}
            />
          )}
        

          {/* Mobile adaptation */}
          {/* Toggle button */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4 ">
              <button
                onClick={toggleMobileFilters}
                className="flex px-4 py-2 bg-stone-600 text-white rounded-lg text-sm gap-2"
              >
                {showMobileFilters ? 'Фільтри' : 'Сортування'}
                <img src={showMobileFilters ? "textures/filters2.png" : "textures/filters1.png"} alt="" className='w-5' />
                
              </button>
            </div>
          )}
          {isMobile && !showMobileFilters && (
            <SortCards
              titleSort={titleSort}
              authorSort={authorSort}
              onTitleSortToggle={toggleTitleSort}
              onAuthorSortToggle={toggleAuthorSort}
              isMobile={isMobile}
            />
          )}
          {isMobile && showMobileFilters && (
            <div className="mb-6 p-4 ">
              <FiltersSection
                filteredBooks={filteredBooks}
                currentPage={currentPage}
                totalPages={totalPages}
                trashbinActive={trashbinActive}
                onClearFilters={clearFilters}
                showFilters={showFilters}
                onShowFiltersChange={setShowFilters}
                selectedGenres={selectedGenres}
                genres={genres}
                currentGenrePage={currentGenrePage}
                totalGenrePages={totalGenrePages}
                onGenrePageChange={setCurrentGenrePage}
                onGenreToggle={handleGenreToggle}
                isMobile={isMobile}
              />
            </div>
          )}
          
          
        </div>

        {filteredBooks.length === 0 ? (
          <ResultEmpty onClearFilters={clearFilters} isMobile={isMobile} />
        ) : (
          <BookGridSection
            books={currentBooks}
            genres={genres}
            onBookClick={onBookClick}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
}