import React from 'react';
import { db } from '../firebase.config'; // Ваш файл конфігурації Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const EXAMPLE_BOOK_DATA = {
  addedBy: "Адмін",
  addedById: "creator",
  author: "Автор піздабол",
  characters: [
    "Кіт",
    "Пес",
    "Щур",
    "У чому концепція я досі не зрозуміла",
    "Кінець"
  ],
  colorHue: "4A90E2",
  createdAt: serverTimestamp(), // Використовуйте serverTimestamp() для Firebase
  description: "Офігітітєльна книга яку варто як зажди прочитати - бо якщо не прочитає то ти лох педальний. Комбінація жаху трилеру фантастики 18+ і ще + 20 жанрів невідомих людству, які навіть не існують у нашій Базі даних - просте це причина щоб прочитати саме цю книжку! Унікальність також полягає в тому - що ХУЙ вам а не книжка - адже наші книги неможливо прочитати онлайн) Лише піднявши свою жопу та купуючи у магазині, ну або для особливо лінивих як я жоп - замовити собі з доставкою. А якщо ви жмот (впринципі як і я - пошукайте в інтернеті бляха).",
  genres: [
    "ySUHRE8hSsd1gXK1o2SV",
    "thriller",
    "horror",
    "romantic_prose",
    "2GmFPOJBhciuYIeKcqSt"
  ],
  imagePath: "https://firebasestorage.googleapis.com/v0/b/bookslibrary-1c8ed.firebasestorage.app/o/book_covers%2F1758834799476_znak%20zaputannia.jpeg?alt=media&token=4f2ef6da-cb84-40e7-bfed-5c5a0b70323a",
  language: "Українська",
  opinion: "Опис стандарт - мабудь це дуже захоплива книга але я хз який тут опис) Бо власниця сайту досі не оновила нічого - просто пустота 0_0. Тому я можу розповісти смішний жарт.... Колобок повісився! Не смішно я знаю, тому 'кароче вопшім да' - фіговий з мене клоун. Якщо знайдете баг або щось вам не подобається - йдіть нафіг коротше, я токсік. Це офігезний сайт! Ну ладно.. напишіть мені в тг @tyshorealnotypuj?. Лю усіх хто прочитав цей брєд до кінця 💖",
  pages: 666,
  publisher: "Абракадабра",
  size: {
    height: 24,
    id: "wide-short",
    width: 9
  },
  title: "Тестова книга",
  year: 2025
};


const AddExampleBookButton = () => {
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const addExampleBook = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Отримання посилання на колекцію "books"
      const docRef = await addDoc(collection(db, "books"), EXAMPLE_BOOK_DATA);
      
      setMessage(`✅ Книгу успішно додано! ID: ${docRef.id}`);
    } catch (e) {
      console.error("Помилка при додаванні документа: ", e);
      setMessage(`❌ Помилка: ${e.message}`);
    } finally {
      setLoading(false);
      // Очищення повідомлення через кілька секунд
      setTimeout(() => setMessage(''), 5000); 
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 p-4">
      {/* Кнопка */}
      <button
        onClick={addExampleBook}
        disabled={loading}
        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50"
      >
        {loading ? 'Додається...' : '➕ Додати Тестову Книгу'}
      </button>

      {/* Повідомлення про статус */}
      {message && (
        <p className={`text-sm ${message.startsWith('❌') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AddExampleBookButton;