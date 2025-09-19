import { useState, useEffect } from 'react';
import Bookshelf from '../components/Bookshelf';
import { GenerateBooks } from "../components/Tools";

export default function HomeScreen() {
  const [books, setBooks] = useState([]);

  // Generate Books
  useEffect(() => {
    GenerateBooks(setBooks, 20);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Bookshelf */}
      <main className="flex-grow relative">
        <Bookshelf books={books} />
      </main>
    </div>
  );
}