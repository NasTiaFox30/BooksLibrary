import Shelf from './Shelf';

export default function Bookshelf({ shelves, books, onBookClick }) {
  console.log('Bookshelf props:', { shelves, books });
  
  if (!shelves || shelves.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center text-amber-900 text-lg py-12">
          Немає полиць для відображення
        </div>
      </div>
    );
  }
  if (!books || books.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center text-amber-900 text-lg py-12">
          Немає книг для відображення
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Top */}
      <div className="h-10 bg-cyan-200 rounded-t-lg"></div>
      {/* Container */}
      <div className="text-cyan-200 p-6 md:p-8 relative">
        {/* Shelves */}
        {shelves.map((shelf, shelfIndex) => (
          <Shelf 
            key={shelfIndex} 
            shelf={shelf} 
            shelfIndex={shelfIndex} 
            books={books} 
            onBookClick={onBookClick}
          />
        ))}
      </div>

      {/* Bottom */}
      <div className='shadow-2xl'>
        <div className='h-8 bg-cyan-400'></div>
      <div className='h-16 bg-cyan-200 rounded-b-md'></div>
      </div>
    </div>
  );
}