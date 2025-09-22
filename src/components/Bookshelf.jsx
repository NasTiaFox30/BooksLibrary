import Shelf from './Shelf';

export default function Bookshelf({ shelves, books, onBookClick }) {
  console.log('Bookshelf props:', { shelves, books });
  
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Top texture */}
      <div 
        className="h-65 rounded-t-lg"
        style={{
          backgroundImage: 'url(/textures/top-bookshelf-texture.png)',
          backgroundSize: 'cover',
          backgroundSize: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Container */}
      <div 
        className="mx-10 p-6 md:p-8 relative border-2"
        style={{
          backgroundColor: '#b2bfc5',
          backgroundSize: '100%',
          backgroundRepeat: 'repeat',
        }}
      >
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

      {/* Bottom texture */}
      <div className=''>
        <div 
          className='h-28'
          style={{
            backgroundImage: 'url(/textures/bottom-bookshelf-texture.png)',
            backgroundSize: 'cover',
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>
    </div>
  );
}