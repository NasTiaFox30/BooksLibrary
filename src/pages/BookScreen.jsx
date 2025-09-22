import { useState, useEffect } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase.config';

export default function BookScreen({ book, onGoBack }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

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
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Book */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="md:flex">
                      
            {/* Left page */}
            <div className="md:w-1/3 p-8 bg-amber-100">
              <div className="sticky top-8">
                {loading ? (
                  <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={book.title}
                    className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="h-96 bg-gray-200 flex items-center justify-center rounded text-gray-700">
                    Немає зображення
                  </div>
                )}
              </div>
            </div>

            {/* Right page */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-4xl font-bold text-amber-900 mb-4">{book.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-600">Автор:</span>
                  <p className="text-lg font-semibold">{book.author || 'Невідомо'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Жанр:</span>
                  <p className="text-lg font-semibold">{book.genre}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Рік видання:</span>
                  <p className="text-lg font-semibold">{book.year || 'Невідомо'}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('description')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'description'
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Опис
                    </button>
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'details'
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Деталі
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'reviews'
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Відгуки
                    </button>
                  </nav>
                </div>

                <div className="mt-4">
                  {activeTab === 'description' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Опис книги</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {book.description || 'Опис відсутній.'}
                      </p>
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Детальна інформація</h3>
                      <div className="space-y-2">
                        <p><strong>Кількість сторінок:</strong> {book.pages || 'Невідомо'}</p>
                        <p><strong>Мова:</strong> {book.language || 'Українська'}</p>
                        <p><strong>Видавництво:</strong> {book.publisher || 'Невідомо'}</p>
                        <p><strong>Переплет:</strong> {book.binding || 'Твердий'}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Відгуки</h3>
                      <p className="text-gray-600">Функціонал відгуків буде додано пізніше.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}