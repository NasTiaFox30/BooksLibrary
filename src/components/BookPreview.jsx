import { useState, useEffect } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase.config';

export default function BookPreview({ book, isOpen, onClose, onOpenBook }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCornerButton, setShowCornerButton] = useState(false);

  useEffect(() => {
    if (book && book.imagePath) {
      loadBookImage();
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

  const handleOpenBook = () => {
    onOpenBook(book);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 text-5xl z-50"
      >&times;
      </button>

      <div
        className="relative max-w-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setShowCornerButton(true)}
        onMouseLeave={() => setShowCornerButton(false)}
      >
        {loading ? (
          <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
        ) : imageUrl ? (
          <div className="relative group">
            <img
              src={imageUrl}
              alt={book.title}
              className="max-w-full max-h-[90vh] object-contain rounded shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            
            <div
              className={`absolute -bottom-3 -right-3 transition-all duration-300 ${showCornerButton ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
              <button
                onClick={handleOpenBook}
                className="relative w-20 h-20 shadow-xl transition-all duration-300 transform hover:scale-110 group"
                title="Відкрити книгу для читання"
              > 
                <div 
                  className="absolute inset-0 bg-stone-300 rounded-br-full"
                  style={{
                    backgroundImage: `url('/textures/paper-texture.png')`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  }}
                ></div>
                
                <div className="relative z-10 w-full h-full flex items-start justify-end p-2">
                  <svg 
                    className="w-8 h-8 transform -rotate-45 group-hover:scale-110 transition-transform text-stone-700" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-96 h-96 bg-gray-200 flex items-center justify-center rounded text-gray-700 text-lg">
            Немає зображення ;(
          </div>
        )}
      </div>
    </div>
  );
}