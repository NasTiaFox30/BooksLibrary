import { useState, useEffect } from 'react';
import Bookshelf from '../components/Bookshelf';
import { GenerateBooks } from "../components/Tools";

export default function HomeScreen() {
  const [books, setBooks] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isBookPreviewOpen, setIsBookPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Generate Books
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      // books
      const { books: generatedBooks, genres } = await GenerateBooks(20);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-900 text-xl">Завантаження книг...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Bookshelf */}
      <main className="flex-grow relative">
        <Bookshelf books={books} />
      </main>
    </div>
  );
}