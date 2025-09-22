import Book from './Book';

export default function Shelf({ shelf, shelfIndex, books, onBookClick }) {
  const shelfBooks = books.filter(book => book.shelf === shelfIndex);
  if (!shelfBooks || shelfBooks.length === 0) {return null;}

  return (
    <div className="mb-10 last:mb-0 relative">
      {/* Shelf and Genre Label Container */}
      <div className="relative flex justify-center">
        {/* Shelf */}
        <div
          className="w-full h-9 relative"
          style={{
            backgroundRepeat: 'no-repeat',
            borderTop: '3px solid #3d424c',
            borderBottom: '3px solid #3d424c'
          }}
        ></div>

        {/* Genre Label - Absolutely positioned and centered */}
        <div
          className="absolute h-15 z-1 top-3 text-black text-2xl font-semibold px-2 py-1"
          style={{
            backgroundImage: 'url(textures/wood-texture.png)',
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {shelf.name}
        </div>
      </div>
      
      {/* Space for books */}
      <div
        className="h-40 rounded-b-md relative -mt-1 pt-2 px-2"
        style={{
          backgroundImage: 'url(textures/shelf-texture.png)',
          backgroundSize: '100%',
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