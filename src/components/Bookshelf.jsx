import Shelf from './Shelf';

export default function Bookshelf({ shelves, books, onBookClick }) {
  console.log('Bookshelf props:', { shelves, books });
  
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Top texture */}
      <div 
        className="h-40 rounded-t-lg relative"
        style={{
          backgroundImage: 'url(/textures/top-bookshelf-texture.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <img
          src="/textures/cat.png"
          alt="Cat"
          className="absolute z-50 right-40 -bottom-20 h-50 w-auto drop-shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 active:scale-95 select-none"
          onClick={onCatClick}
          title="Мяу 💤"
        />
      </div>
      <div className='h-8 rounded-l border-2 border-b-0 mx-10'
        style={{
          backgroundColor: '#d4d4d4',
        }}></div>
      
      {/* Container */}
      <div 
        className="mx-10 px-6 md:px-8 relative border-2 border-b-0"
        style={{
          backgroundColor: '#d4d4d4',
          backgroundSize: '100%',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className='border-2 border-b-0 '>
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