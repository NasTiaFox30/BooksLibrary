import { useState, useEffect } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase.config';
import { Tape } from '../components/Decor';
import { getGenres } from '../services/booksService';
import featherIcon from '/textures/decor/decor8.png';
import characterIcon from '/textures/decor/decor9.png';
import arrowIcon from '/textures/decor/arrow.svg';

export default function BookScreen({ book, onGoBack, isMobile }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [genreNames, setGenreNames] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [showCornerButton, setShowCornerButton] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (book) {
      if (book.imagePath) {
        loadBookImage();
      }
      if (book.genres && book.genres.length > 0) {
        loadGenreNames();
      }
      if (book.characters) {
        loadCharacters();
      }
    }
  }, [book]);

  const loadBookImage = async () => {
    try {
      setLoading(true);
      if (!book.imagePath) {
        throw new Error('Шлях до зображення не вказаний');
      }
      
      const url = await getDownloadURL(ref(storage, book.imagePath));
      setImageUrl(url);
    } catch (error) {
      console.error('Помилка завантаження зображення:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGenreNames = async () => {
    if (!book || !book.genres || book.genres.length === 0) {
      setGenreNames(['Невідомо']);
      return;
    }

    try {
      const allGenres = await getGenres();
      
      const genresMap = allGenres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
      }, {});
      
      // search by id
      const names = book.genres.map(genreId => genresMap[genreId]).filter(name => name);
      
      setGenreNames(names.length > 0 ? names : ['Невідомо']);
    } catch (error) {
      console.error("Помилка завантаження назв жанрів:", error);
      setGenreNames(['Невідомо']);
    }
  };
  
  const loadCharacters = () => {
    setCharacters(book.characters || []);
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} text-amber-900 mb-4`}>Книга нажаль не знайдена :(</h2>
          <button 
            onClick={onGoBack}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
          >
            Повернутися до бібліотеки
          </button>
        </div>
      </div>
    );
  }

  // Мобільна версія з табами
  if (isMobile) {
    return (
      <div className="min-h-screen py-4 px-3">
        {/* Заголовок і кнопка назад */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-stone-900 text-center flex-1 mx-2 line-clamp-2">
            {book.title}
          </h1>
        </div>

        {/* Зображення книги */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Tape degree="0" size="60" top={-30} left={30}/>
            {loading ? (
              <div className="w-32 h-48 bg-gray-200 animate-pulse rounded-lg shadow-md"></div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={book.title}
                className="w-32 h-48 object-cover opacity-95 shadow-md rounded-lg"
              />
            ) : (
              <div className="w-32 h-48 bg-gray-200 flex items-center justify-center rounded-lg text-gray-700 border-2 border-amber-300 text-xs p-2 text-center">
                Немає зображення
              </div>
            )}
          </div>
        </div>

        {/* Таби для мобільних */}
        <div className="bg-white rounded-lg shadow-md mb-4">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === 'info' 
                  ? 'text-stone-600 border-b-2 border-stone-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('info')}
            >
              Інформація
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === 'description' 
                  ? 'text-stone-600 border-b-2 border-stone-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Опис
            </button>
          </div>

          <div className="p-4">
            {/* Вкладка Інформація */}
            {activeTab === 'info' && (
              <div className="space-y-4 mb-20">
                <div>
                  <div className="space-y-2 text-md text-gray-700">
                    <p><span className="font-semibold">Автор:</span> <span className='pacifico-regular'>{book.author || 'Невідомо'}</span></p>
                    <p><span className="font-semibold">Жанр:</span> <span className='pacifico-regular'>{genreNames.join(', ')}</span></p>
                    <p><span className="font-semibold">Рік:</span> <span className='pacifico-regular'>{book.year || 'Невідомо'}</span></p>
                    <p><span className="font-semibold">Сторінок:</span> <span className='pacifico-regular'>{book.pages || 'Невідомо'}</span></p>
                    <p><span className="font-semibold">Мова:</span> <span className='pacifico-regular'>{book.language || 'Українська'}</span></p>
                    <p><span className="font-semibold">Видавництво:</span> <span className='pacifico-regular'>{book.publisher || 'Невідомо'}</span></p>
                  </div>
                </div>

                {/* Персонажі */}
                {characters.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center">
                      <img src={characterIcon} alt="" className='h-6 w-6 mr-2' />
                      Персонажі:
                    </h3>
                    <ul className="space-y-1">
                      {characters.slice(0, 10).map((character, index) => (
                        <li key={index} className="flex items-start text-md">
                          <img src={arrowIcon} alt="" className='mr-2 w-3 mt-1 rotate-135' />
                          <span className="text-gray-700 pacifico-regular">{character}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Вкладка Опис */}
            {activeTab === 'description' && (
              <div>
                <h2 className="text-lg font-bold mb-3">Про книгу</h2>
                <div className="text-gray-700 leading-relaxed text-md mb-10">
                  <p className='pacifico-regular'>{book.description || 'Опис відсутній.'}</p>
                </div>

                <div className="relative">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="text-lg font-bold mb-2 flex items-center text-amber-800">
                      <img src={featherIcon} alt="" className='w-6 h-6 mr-2' />
                      Моя думка
                    </h3>
                    <p className="text-gray-700 leading-relaxed italic pacifico-regular text-md">
                      "{book.opinion || 'Власниця не залишила свою думку про книгу.'}"
                    </p>
                  </div>
                  <Tape degree="45" size="40" top={-15} right={-10}/> 
                </div>
                
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop
  return (
    <div className="min-h-screen py-8 px-4">
      {/* Book view */}
      <div
        className="h-210 w-7xl mx-auto shadow-2xl overflow-hidden"
        style={{
          backgroundImage: `url('/textures/bookview-white.png')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="md:flex min-h-[600px]">
          
          {/* Left page */}
          <div className="md:w-1/2 h-210 p-10 pl-20 relative"
              onMouseEnter={() => setShowCornerButton(true)}
            onMouseLeave={() => setShowCornerButton(false)}
          >

            {/* Top right page */}
            <div className="relative mb-8">

              {/* Image */}
              <div className="relative inline-block">
                <Tape degree="0" size="80" top={-40} left={50}/>
                {loading ? (
                  <div className="w-48 h-64 bg-gray-200 animate-pulse rounded-lg shadow-md"></div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={book.title}
                    className="w-48 h-64 object-cover opacity-95 shadow-md"
                  />
                ) : (
                  <div className="w-48 h-64 bg-gray-200 flex items-center justify-center rounded-lg text-gray-700 border-2 border-amber-300">
                    Немає зображення
                  </div>
                )}
              </div>

              {/* Main Info */}
              <div className="md:w-1/2 mt-4 ml-9 inline-block align-top">
                <h1 className="text-2xl font-bold mb-2 max-w-xs">{book.title}</h1>
                <div className="space-y-1">
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Автор:</span> <span className='pacifico-regular'>{book.author || 'Невідомо'}</span>
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Жанр:</span> <span className='pacifico-regular'>{genreNames.join(', ')}</span>
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Рік:</span> <span className='pacifico-regular'>{book.year || 'Невідомо'}</span>
                  </p>
                </div>
              </div>
              
            </div>

              {/* Characters */}
            <div className="mt-8">
                <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                  <img src={characterIcon} alt="" className='h-12 w-12' />
                  Персонажі книги:
                </h3>
                <ul className="grid grid-cols-2 space-y-2">
                  {characters.length > 0 ? (
                  characters.map((character, index) => (
                    <li key={index} className="flex items-start">
                    <img src={ arrowIcon } alt="" className='mr-2 w-3 rotate-135' />
                    <span className="text-gray-700 pacifico-regular">{character}</span>
                    </li>
                  ))
                  ) : (
                    <p className="text-gray-500 italic">Інформація про персонажів відсутня.</p>
                  )}
                </ul>
              </div>

              {/* Addition info */}
              <div className="mt-15 grid gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Сторінок:</span> <span className='pacifico-regular'>{book.pages || 'Невідомо'}</span>
                </div>
                <div>
                  <span className="font-semibold">Мова:</span> <span className='pacifico-regular'>{book.language || 'Українська'}</span>
                </div>
                <div>
                  <span className="font-semibold">Видавництво:</span> <span className='pacifico-regular'>{book.publisher || 'Невідомо'}</span>
                </div>
              </div>
            
            {/* corner */}
            <div
              className={`absolute z-10 bottom-6 left-11 transition-all duration-300 ${showCornerButton ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
              <button
                onClick={onGoBack}
                className="relative w-20 h-20 shadow-xl transition-all duration-300 transform hover:scale-110 group"
              > 
                <div 
                  className="absolute inset-0 bg-stone-300 border-1 rounded-bl-full"
                  style={{
                    backgroundImage: `url('/textures/paper-texture.png')`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  }}
                ></div>
                
                <div className="relative z-10 w-full h-full flex items-start justify-end p-2">
                  <svg 
                    className="w-8 h-8 transform -rotate-135 group-hover:scale-110 transition-transform text-stone-700" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>

          </div>

          {/* Right page */}
          <div className="md:w-1/2 h-210 p-10 pr-20 relative">

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                Про книгу:
              </h2>
              <div className="text-gray-700 leading-relaxed text-lg">
                <p className='pacifico-regular'>{book.description || 'Опис відсутній.'}</p>
              </div>
            </div>

            {/* Opinion note */}
            <div className="relative mt-12">
              <div className="bg-yellow-50 p-6 rounded-lg shadow-md relative">
                <h3 className="text-xl font-bold mb-3 flex items-center text-amber-800">
                  <img src={featherIcon} alt="" className='w-10 h-10 mr-2' />
                  Моя думка
                </h3>
                <p className="text-gray-700 leading-relaxed italic pacifico-regular">
                  "{book.opinion || 'Власниця не залишила свою думку про книгу.'}"
                </p>
              </div>

              <Tape degree="45" size="60" top={-20} right={-20}/> 
              <Tape degree="45" size="50" bottom={-20} left={-20}/>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}