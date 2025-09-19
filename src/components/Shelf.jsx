import Book from './Book';

export default function Shelf({ shelf, shelfIndex, books }) {
  const shelfBooks = books.filter(book => book.shelf === shelfIndex);

  return (
    <div className="mb-10 last:mb-0 relative">
      {/* Сама полиця */}
      <div className="h-6 bg-amber-700 rounded-md shadow-md relative">
        <div className="absolute top-0 left-4 text-amber-200 text-sm font-semibold pt-1">
          {shelf.genre}
        </div>
      </div>
      
      {/* Простір для книг на полиці */}
      <div className="h-32 bg-amber-600 rounded-b-md relative -mt-1 pt-2 px-2">
        {/* Книги на цій полиці */}
        {shelfBooks.map(book => (
          <Book key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}