import BookCard from './BookCard';
import BookPagination from './BookPagination';

export default function BookGridSection({ books, genres, onBookClick, currentPage, totalPages, onPageChange, isMobile }) {
  return (
    <>
      <div className={`grid grid-cols-2 ${
        isMobile ? 'gap-4' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'
      } mb-6 md:mb-8`}>
        {books.map((book, index) => (
          <BookCard
            key={book.id}
            book={book}
            genres={genres}
            onBookClick={onBookClick}
            index={index}
            isMobile={isMobile}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <BookPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isMobile={isMobile}
        />
      )}
    </>
  );
}