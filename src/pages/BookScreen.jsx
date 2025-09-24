import { useState, useEffect } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase.config';
import { Tape } from '../components/Decor';
import { getGenres } from '../services/booksService';
import decor5 from '/textures/decor/decor8.png';

export default function BookScreen({ book, onGoBack }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [genreNames, setGenreNames] = useState([]);
  const [characters, setCharacters] = useState([]);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-amber-900 mb-4">Книга нажаль не знайдена :(</h2>
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

  return (
    <div className="min-h-screen py-8 px-4">

      {/* Book view */}
      <div
        className="h-200 w-7xl mx-auto shadow-2xl overflow-hidden"
        style={{
          backgroundImage: `url('/textures/bookview-white.png')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="md:flex min-h-[600px]">
          
          {/* Left page */}
          <div className="md:w-1/2 p-10 pl-20 relative">

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
              <div className="mt-4 ml-4 inline-block align-top">
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
                Персонажі книги
              </h3>
              <ul className="space-y-2">
                {characters.map((character, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-600 mr-2">-></span>
                    <span className="text-gray-700 pacifico-regular">{character}</span>
                  </li>
                ))}
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

            
          </div>

          {/* Right page */}
          <div className="md:w-1/2 p-10 pr-20 relative">

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
                  <img src={decor5} alt="" className='w-10 h-10 mr-2' />
                  Моя думка
                </h3>
                <p className="text-gray-700 leading-relaxed italic pacifico-regular">
                  "{adminReview}"
                </p>
                <div className="mt-3 text-right text-sm ">
                  ~ Власниця
                </div>
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