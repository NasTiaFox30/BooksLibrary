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

      // Формуємо об'єкт книги
      const newBook = {
        title: title.trim(),
        author: author.trim(),
        year: year ? Number(year) : null,
        description: description.trim(),
        imagePath: imagePath || null,
        colorHue: colorHue ? colorHue : Math.floor(Math.random() * 360),
        genres: selectedGenres, // масив id жанрів
        createdAt: new Date()
      };

      // Додаємо документ у колекцію books
      await addDoc(collection(db, 'books'), newBook);

      // Очистка форми
      setTitle('');
      setAuthor('');
      setYear('');
      setPages('');
      setLanguage('Українська');
      setPublisher('');
      setDescription('');
      setFile(null);
      setPreviewUrl(null);
      setSelectedGenres([]);
      setColorHue('#4A90E2');
      setSelectedSize('classic');
      setUploadProgress(null);

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error('Помилка під час створення книги:', err);
      setError('Помилка при збереженні. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
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

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="font-medium mb-1">Назва</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 border rounded" />
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-1">Автор</span>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className="p-2 border rounded" />
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-1">Рік</span>
          <input value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border rounded" />
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-1">Мова (завмовчуванням 'Українська')</span>
          <input value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 border rounded" />
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-1">Кількість сторінок</span>
          <input value={pages} onChange={(e) => setPages(e.target.value)} className="p-2 border rounded" />
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-1">Видавництво</span>
          <input value={publisher} onChange={(e) => setPublisher(e.target.value)} className="p-2 border rounded" />
        </label>

        {/* Відображеня на сторінці */}

        {/* TODO: ВИБІР РОЗМІРУ КНИГИ) */}

        <label className="flex flex-col">
        <span className="font-medium mb-1">Колір обкладинки</span>
        <input
          type="color"
          value={colorHue}
          onChange={(e) => setColorHue(e.target.value)}
          className="w-12 h-12 border-none  cursor-pointer p-0"
        />
      </label>

      </div>

      <label className="flex flex-col mt-4">
        <span className="font-medium mb-1">Опис</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="p-2 border rounded" />
      </label>

      <div className="mt-4">
        <span className="font-medium mb-2 block">Жанри (оберіть один або кілька)</span>
        <div className="flex flex-wrap gap-2">
          {genresList.map(g => (
            <button
              key={g.id}
              type="button"
              onClick={() => handleGenreToggle(g.id)}
              className={`px-3 py-1 rounded-full border ${selectedGenres.includes(g.id) ? 'bg-amber-400 text-white' : 'bg-white'}`}>
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="">
          <input type="file" accept="image/*" className='cursor-pointer rounded-md border-1 p-2 bg-blue-50' onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>

        {previewUrl && (
          <div className="mt-4">
            <div className="w-40 h-56 border rounded overflow-hidden">
              <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {uploadProgress !== null && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 h-2 rounded">
              <div style={{ width: `${uploadProgress}%` }} className="h-2 rounded" />
            </div>
            <div className="text-sm mt-1">Завантаження: {uploadProgress}%</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        <button type="button" onClick={() => {
          // Очистка
          setTitle(''); setAuthor(''); setYear(''); setDescription(''); setFile(null); setPreviewUrl(null); setSelectedGenres([]); setColorHue(''); setError(null);
        }} className="px-4 py-2 border rounded">Очистити</button>

        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-400 text-white rounded disabled:opacity-60">
          {loading ? 'Збереження...' : 'Додати книгу'}
        </button>
      </div>
    </form>
  );
}
