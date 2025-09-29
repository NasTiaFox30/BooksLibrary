import BookCard from './BookCard';
import BookPagination from './BookPagination';

export default function BookGridSection({ books, genres, onBookClick, currentPage, totalPages, onPageChange }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
        {books.map((book, index) => (
          <BookCard
            key={book.id}
            book={book}
            genres={genres}
            onBookClick={onBookClick}
            index={index}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <BookPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}