import { useState, useEffect } from 'react';
import Bookshelf from '../components/HomeScreen/Bookshelf';
import BookPreview from '../components/BookPreview';
import { GenerateBooks } from "../components/Tools";

export default function HomeScreen({ onOpenBook, onCatClick, onLampClick, isLightOn, onOpenCollection, isMobile }) {
  const [books, setBooks] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isBookPreviewOpen, setIsBookPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Generate Books
  useEffect(() => {
    loadBooks();
  }, [isMobile]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      // books
      const bookCount = isMobile ? 8 : 20;
      const { books: generatedBooks, genres } = await GenerateBooks(bookCount);
      setBooks(generatedBooks);

      // shelves
      const shelvesData = genres.map(genre => ({ id: genre.id, name: genre.name }));
      setShelves(shelvesData);

    } catch (error) {
      console.error('Помилка завантаження:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsBookPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsBookPreviewOpen(false);
    setSelectedBook(null);
  };

  const handleOpenBook = (book) => {
    setIsBookPreviewOpen(false);
    onOpenBook(book);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-900 text-xl">Завантаження книг...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* CollectionScreen - link*/}
      <div className={`absolute z-10 ${
        isMobile 
          ? 'left-0 right-0 -top-5 px-4' 
          : 'left-50 right-50 top-0'
      }`}>
        <button 
          onClick={onOpenCollection}
          className="w-full h-28 cursor-pointer"
          style={{
            backgroundImage: 'url(/textures/collection-texture.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',  
          }}
        >
        </button>
      </div>
      
      {/* Bookshelf */}
      <main className={`flex-grow relative ${isMobile ? 'mt-16' : ''}`}>
        <Bookshelf 
          shelves={shelves} 
          books={books} 
          onBookClick={handleBookClick}
          onCatClick={onCatClick}
          onLampClick={onLampClick}
          isLightOn={isLightOn}
          isMobile={isMobile}
        />
      </main>

      <BookPreview 
        book={selectedBook} 
        isOpen={isBookPreviewOpen} 
        onClose={handleClosePreview}
        onOpenBook={handleOpenBook}
      />
    </div>
  );
}