import Book from './Book';

export default function Shelf({ shelf, shelfIndex, books, onBookClick, isMobile }) {
  const shelfBooks = books.filter(book => book.shelf === shelfIndex);
  if (!shelfBooks || shelfBooks.length === 0) {return null;}

  return (
    <div className={`relative ${isMobile ? 'mb-6' : 'mb-10'} last:mb-0`}>
      {/* Shelf and Genre Label Container */}
      <div className="relative flex justify-center">
        {/* Shelf */}
        {/* Genre Label */}
        <div
          className={`absolute pacifico-regular z-40 -top-6 flex items-center justify-center text-center text-black font-semibold px-2 py-1 ${
            isMobile ? 'w-28 h-15 text-lg' : 'w-35 h-18 text-xl'
          }`}
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
        className={`relative ${
          isMobile ? 'h-32 -mt-1 pt-1 px-1' : 'h-40 -mt-1 pt-2 px-2'
        }`}
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
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}