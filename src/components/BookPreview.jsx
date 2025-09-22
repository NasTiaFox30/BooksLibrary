import { useState, useEffect } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase.config';

export default function BookPreview({ book, isOpen, onClose }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

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
        
        if (!book.imagePath.includes(book.id)) {
        console.warn('Можливо неправильний шлях до зображення:', book.imagePath);
        }
        
        const url = await getDownloadURL(ref(storage, book.imagePath));
        setImageUrl(url);
    } catch (error) {
        console.error('Помилка завантаження зображення:', error);
    } finally {
        setLoading(false);
    }
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
      >
        {loading ? (
          <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={book.title}
            className="max-w-full max-h-[90vh] object-contain rounded shadow-lg"
          />
        ) : (
          <div className="w-96 h-96 bg-gray-200 flex items-center justify-center rounded text-gray-700 text-lg">
            Немає зображення ;(
          </div>
        )}
      </div>
    </div>
  );
}