import Book from './Book';

export default function Shelf({ shelf, shelfIndex, books, onBookClick }) {
  const shelfBooks = books.filter(book => book.shelf === shelfIndex);
  if (!shelfBooks || shelfBooks.length === 0) {return null;}

  return (
    <div className="mb-10 last:mb-0 relative">
      {/* Shelf */}
      <div className="h-6 bg-amber-700 rounded-md shadow-md relative">
        <div className="absolute top-0 left-4 text-amber-200 text-sm font-semibold pt-1">
          {shelf.genre}
        </div>
      </div>
      
      {/* Space for books */}
      <div className="h-32 bg-amber-600 rounded-b-md relative -mt-1 pt-2 px-2">
        {shelfBooks.map(book => (
          <Book 
            key={book.id} 
            book={book} 
            onBookClick={onBookClick}
          />
        ))}
      </div>
    </div>
  );
}