import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.config'

// Компонент форми для додавання нової книги (всі дані + фото)
export default function AddNewBookForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [pages, setPages] = useState('');
  const [language, setLanguage] = useState('Українська');
  const [publisher, setPublisher] = useState('');
  const [description, setDescription] = useState('');
  const [colorHue, setColorHue] = useState('');
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
      setDescription('');
      setFile(null);
      setPreviewUrl(null);
      setSelectedGenres([]);
      setColorHue('');
      setUploadProgress(null);

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error('Помилка під час створення книги:', err);
      setError('Помилка при збереженні. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Додати нову книгу 📘</h2>

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
          <span className="font-medium mb-1">Мова (необовязково - завмовчуванням 'Українська')</span>
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
          <span className="font-medium mb-1">Колір (HEX 000000)</span>
          <input value={colorHue} onChange={(e) => setColorHue(e.target.value)} placeholder="наприклад 7c1716" className="p-2 border rounded" />
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
        <label className="flex items-center gap-4">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <span className="text-sm text-gray-600">Обрати обкладинку (опціонально)</span>
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
