import Shelf from './Shelf';

export default function Bookshelf({ shelves, books, onBookClick, onLampClick, onCatClick, isLightOn }) {
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
        {/* Кнопка переходу до колекції */}
        <div className="absolute left-50 right-50 bottom-8 text-center mt-4">
          <button 
            onClick={onOpenCollection}
            className=" text-black x-6 py-2 transition-colors"
          >
            Переглянути повну колекцію
          </button>
        </div>
        
        {/* Lamp */ }
          <img
            src={isLightOn ? "/textures/oillamp-on.png" : "/textures/oillamp-off.png"}
            alt="Oil Lamp"
            className="absolute z-50 left-60 -bottom-1 h-30 w-auto drop-shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 active:scale-95 select-none lamp-icon"
            onClick={onLampClick}
            title={isLightOn ? "Вимкнути світло" : "Увімкнути світло"}
          />
          {isLightOn && (
            <div 
              className="absolute z-60 left-57 -bottom-3 w-26 h-25 pointer-events-none flame-effect"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(241, 207, 143, 0.6) 0%, transparent 70%)',
                filter: 'blur(5px)',
              }}
            />
          )}
        
        {/* Cat */}
        <img
          src="/textures/cat.png"
          alt="Cat"
          className="absolute z-40 right-40 -bottom-20 h-50 w-auto drop-shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 active:scale-95 select-none"
          onClick={onCatClick}
          title="Мяу 💤"
        />
        <img src="/textures/decor/sleep-anim.gif" alt=""
          className="absolute right-60 top-5 h-25 w-auto drop-shadow-lg select-none" />
      </div>
      <div className='h-8 rounded-l border-2 border-b-0 mx-10'
        style={{ backgroundColor: '#d4d4d4' }}></div>
      
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