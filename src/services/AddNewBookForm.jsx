import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.config'

// Variants
const BOOK_SIZES = [
  { id: 'classic', name: '📚 Класична', width: 8, height: 26, label: '26x8' },
  { id: 'narrow-medium', name: '📖 Вузька середня', width: 7, height: 24, label: '24x7' },
  { id: 'medium-tall', name: '📘 Середня висока', width: 8, height: 28, label: '28x8' },
  { id: 'narrow-tall', name: '📕 Вузька висока', width: 7, height: 28, label: '28x7' },
  { id: 'wide-short', name: '📗 Широка низька', width: 9, height: 24, label: '24x9' },
  { id: 'large', name: '📙 Велика', width: 9, height: 28, label: '28x9' }
];

export default function AddNewBookForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [pages, setPages] = useState('');
  const [language, setLanguage] = useState('Українська');
  const [publisher, setPublisher] = useState('');
  const [description, setDescription] = useState('');
  const [opinion, setOpinion] = useState('');
  const [colorHue, setColorHue] = useState('#4A90E2');
  const [selectedSize, setSelectedSize] = useState('classic');
  const [genresList, setGenresList] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Завантажуємо жанри з Firebase
    const loadGenres = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'genres'));
        const genres = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGenresList(genres);
      } catch (err) {
        console.error('Не вдалося завантажити жанри', err);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    // Показ прев'ю картинки
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
    return () => reader.abort && reader.abort();
  }, [file]);

  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) return prev.filter(g => g !== genreId);
      return [...prev, genreId];
    });
  };

  const validate = () => {
    if (!title.trim()) return 'Вкажіть назву книги.';
    if (!author.trim()) return 'Вкажіть автора.';
    if (year && isNaN(Number(year))) return 'Рік має бути числом.';
    if (selectedGenres.length === 0) return 'Оберіть принаймні один жанр.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setUploadProgress(null);

    try {
      let imagePath = null;

      // Якщо файл обрано - завантажуємо у Firebase Storage
      if (file) {
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `book_covers/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Обробка прогресу
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
          }, (err) => {
            console.error('Помилка завантаження зображення:', err);
            reject(err);
          }, async () => {
            // Завершено
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            imagePath = downloadURL;
            resolve();
          });
        });
      }

      // Отримуємо обраний розмір
      const selectedSizeData = BOOK_SIZES.find(size => size.id === selectedSize);
      
      const newBook = {
        title: title.trim(),
        author: author.trim(),
        year: year ? Number(year) : null,
        pages: pages ? Number(pages) : null,
        language: language.trim(),
        publisher: publisher.trim(),
        description: description.trim(),
        opinion: opinion.trim(),
        imagePath: imagePath || null,
        colorHue: colorHue.replace('#', ''),
        size: selectedSizeData ? {
          id: selectedSizeData.id,
          width: selectedSizeData.width,
          height: selectedSizeData.height
        } : { id: 'classic', width: 8, height: 26 },
        genres: selectedGenres,
        createdAt: new Date()
      };

      // Додаємо документ у колекцію books
      await addDoc(collection(db, 'books'), newBook);

      ClearFields();

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error('Помилка під час створення книги:', err);
      setError('Помилка при збереженні. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  const ClearFields = () => {
      setTitle('');
      setAuthor('');
      setYear('');
      setPages('');
      setLanguage('Українська');
      setPublisher('');
      setDescription('');
      setOpinion('');
      setFile(null);
      setPreviewUrl(null);
      setSelectedGenres([]);
      setColorHue('#4A90E2');
      setSelectedSize('classic');
      setUploadProgress(null);
      setError(null);
  };

  // Book preview example
  const renderBookPreview = () => {
    const size = BOOK_SIZES.find(s => s.id === selectedSize) || BOOK_SIZES[0];
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Попередній перегляд на полиці:</h3>
        <div className="flex items-end space-x-2">
          <div 
            className="border border-1 border-gray-300 rounded-xs flex items-center justify-center relative shadow-md"
            style={{
              width: `${size.width * 4}px`,
              height: `${size.height * 4}px`,
              backgroundColor: colorHue,
              backgroundImage: `url('/textures/book-texture.png')`,
              backgroundSize: 'cover',
              backgroundBlendMode: 'multiply',
            }}
          >
            <span 
              className="text-xs text-center font-bold text-white text-wrap rotate-90 transform origin-center"
              style={{ fontSize: '10px' }}
            >
              {title || 'Назва книги'}
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-black opacity-20"></div>
          </div>
          <div className="text-xs text-gray-600">
            Розмір: {size.label}
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Додати нову книгу 📘</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col">
          <span className="font-medium mb-2">Назва книги *</span>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-amber-500" 
            placeholder="Введіть назву книги"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-2">Автор *</span>
          <input 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-amber-500" 
            placeholder="Введіть автора"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-2">Рік видання</span>
          <input 
            type="number"
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-amber-500" 
            placeholder="Наприклад: 2025"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-2">Мова</span>
          <input 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-amber-500" 
            placeholder="Українська"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-2">Кількість сторінок</span>
          <input 
            type="number"
            value={pages} 
            onChange={(e) => setPages(e.target.value)} 
            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-amber-500" 
            placeholder="Наприклад: 256"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-2">Видавництво</span>
          <input 
            value={publisher} 
            onChange={(e) => setPublisher(e.target.value)} 
            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-amber-500" 
            placeholder="Назва видавництва"
          />
        </label>
      </div>

      {/* Вибір розміру книги */}
      <div className="mt-6">
        <span className="font-medium mb-3 block">Розмір книги на полиці</span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {BOOK_SIZES.map(size => (
            <label key={size.id} className="flex items-center p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="bookSize"
                value={size.id}
                checked={selectedSize === size.id}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="font-medium">{size.name}</div>
                <div className="text-sm text-gray-600">{size.label} (px)</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Колір обкладинки */}
      <div className="mt-6 flex items-center gap-4">
        <label className="flex flex-col">
          <span className="font-medium mb-2">Колір обкладинки</span>
          <input
            type="color"
            value={colorHue}
            onChange={(e) => setColorHue(e.target.value)}
            className="w-16 h-16 border-none rounded cursor-pointer p-0"
          />
        </label>
        {renderBookPreview()}
      </div>

      {/* Персонажі */}
      <div className="mt-6">
        <span className="font-medium mb-3 block">Персонажі книги</span>
        {characters.map((char, index) => (
          <div key={char.id} className="flex items-center gap-2 mb-2">
            <input
              value={char.name}
              onChange={(e) => handleCharacterChange(char.id, e.target.value)}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:border-amber-500 flex-grow"
              placeholder={`Персонаж ${index + 1}`}
            />
            {characters.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveCharacter(char.id)}
                className="p-2 text-red-600 hover:text-red-800 transition-colors"
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddCharacter}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          ➕ Додати ще персонажа
        </button>
      </div>

      {/* Опис */}
      <label className="flex flex-col mt-6">
        <span className="font-medium mb-2">Опис книги</span>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          rows={5} 
          className="p-3 border border-gray-300 rounded focus:outline-none focus:border-amber-500" 
          placeholder="Опишіть книгу..."
        />
      </label>

      {/* Моя думка */}
      <label className="flex flex-col mt-6">
        <span className="font-medium mb-2">Моя власна думка </span>
        <textarea 
          value={opinion} 
          onChange={(e) => setOpinion(e.target.value)} 
          rows={4} 
          className="p-3 border border-gray-300 rounded focus:outline-none focus:border-amber-500" 
          placeholder="Що думаєш? Опиши свої враження..."
        />
      </label>

      {/* Жанри */}
      <div className="mt-6">
        <span className="font-medium mb-3 block">Жанри * (оберіть один або кілька)</span>
        <div className="flex flex-wrap gap-2">
          {genresList.map(g => (
            <button
              key={g.id}
              type="button"
              onClick={() => handleGenreToggle(g.id)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedGenres.includes(g.id) 
                  ? 'bg-amber-500 text-white border-amber-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300'
              }`}>
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Завантаження зображення */}
      <div className="mt-6">
        <label className="block font-medium mb-2">Обкладинка книги</label>
        
        {!previewUrl && (
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <label className="cursor-pointer">
              <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 transition-colors">
                📷 Обрати зображення
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
              />
            </label>
          </div>
        )}
        {previewUrl && (
          <div className="flex items-center gap-4">
            <div className="w-40 h-56 border rounded overflow-hidden shadow-md">
              <img src={previewUrl} alt="Прев'ю обкладинки" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Видалити
            </button>
          </div>
        )} 

        {uploadProgress !== null && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 h-3 rounded">
              <div 
                style={{ width: `${uploadProgress}%` }} 
                className="h-3 rounded bg-green-500 transition-all duration-300"
              />
            </div>
            <div className="text-sm mt-1 text-gray-600">Завантаження: {uploadProgress}%</div>
          </div>
        )}
      </div>

      {/* Кнопки */}
      <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
        <button 
          type="button" 
          onClick={ClearFields}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Очистити все
        </button>

        <button 
          type="submit" 
          disabled={loading} 
          className="px-8 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '⏳ Збереження...' : '✅ Додати книгу'}
        </button>
      </div>
    </form>
  );
}
