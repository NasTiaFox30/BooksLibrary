import Book from './Book';

export default function Shelf({ shelf, shelfIndex, books, onBookClick }) {
  const shelfBooks = books.filter(book => book.shelf === shelfIndex);
  if (!shelfBooks || shelfBooks.length === 0) {return null;}

  return (
    <div className="mb-10 last:mb-0 relative">
      {/* Shelf and Genre Label Container */}
      <div className="relative flex justify-center">
        {/* Shelf */}
        {/* Genre Label - Fixed size and centered */}
        <div
          className="absolute pacifico-regular z-40 -top-6 w-35 h-18 flex items-center justify-center text-center text-black text-xl font-semibold px-2 py-1"
          style={{
            backgroundImage: 'url(textures/wood-sign.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {shelf.name}
        </div>
      </div>

      {/* Space for books */}
      <div
        className="h-40 relative -mt-1 pt-2 px-2"
        style={{
          backgroundImage: 'url(textures/shelf-texture.png)',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          borderLeft: '3px solid #3d424c',
          borderRight: '3px solid #3d424c',
          borderBottom: '3px solid #3d424c'
        }}
      >
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