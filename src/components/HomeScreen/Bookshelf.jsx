import Shelf from './Shelf';

export default function Bookshelf({ shelves, books, onBookClick, onLampClick, onCatClick, isLightOn, isMobile }) {
  console.log('Bookshelf props:', { shelves, books });
  
  return (
    <div className={`mx-auto ${isMobile ? 'max-w-full px-1' : 'max-w-6xl px-4'}`}>
      {/* Top texture */}
      <div 
        className={`rounded-t-lg relative ${
          isMobile ? 'h-20' : 'h-40'
        }`}
        style={{
          backgroundImage: isMobile 
          ? 'none' 
          : 'url(/textures/top-bookshelf-texture.png)',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          width: '100%',  
        }}
      >
        {/* Lamp */}
        <img
          src={isLightOn ? "/textures/oillamp-on.png" : "/textures/oillamp-off.png"}
          alt="Oil Lamp"
          className={`absolute z-50 drop-shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 active:scale-95 select-none lamp-icon ${
            isMobile 
              ? 'left-15 -bottom-1 h-20' 
              : 'left-60 -bottom-1 h-30'
          }`}
          onClick={onLampClick}
          title={isLightOn ? "Вимкнути світло" : "Увімкнути світло"}
        />
        {isLightOn && (
          <div 
            className={`absolute z-60 pointer-events-none flame-effect ${
              isMobile 
                ? 'left-2 -bottom-4 w-20 h-20' 
                : 'left-57 -bottom-3 w-26 h-25'
            }`}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(241, 207, 143, 0.6) 0%, transparent 70%)',
              filter: 'blur(5px)',
            }}
          />
        )}
        
        {/* Cat */}
        <div
          className={`absolute z-40 select-none ${
            isMobile
              ? 'right-4 -bottom-14 h-35 w-auto'
              : 'right-40 -bottom-20 h-50 w-auto '
          }`}
        >
          <img
            src="/textures/cat.png"
            alt="Cat"
            className="drop-shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 active:scale-95 w-full h-full"
            onClick={onCatClick}
            title="Мяу 💤"
          />
          <img
            src="/textures/decor/sleep-anim.gif"
            alt=""
            className="absolute -top-13 w-30 drop-shadow-lg"
          />
        </div>
      </div>
      <div className={`rounded-l border-2 border-b-0 ${
        isMobile ? 'h-4 mx-4' : 'h-8 mx-10'
          }`} style={{ backgroundColor: '#d4d4d4' }}></div>
      
      {/* Container */}
      <div 
        className={`relative border-2 border-b-0 ${
          isMobile ? 'mx-4 px-2' : 'mx-10 px-6 md:px-8'
        }`}
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
              isMobile={isMobile}
            />
          ))}
        </div>
        
      </div>

      {/* Bottom texture */}
      <div>
        <div 
          className={isMobile ? 'h-15' : 'h-28'}
          style={{
            backgroundImage: 'url(/textures/bottom-bookshelf-texture.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '100%', 
          }}
        ></div>
      </div>
    </div>
  );
}