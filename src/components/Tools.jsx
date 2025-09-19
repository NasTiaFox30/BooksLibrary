import { shelves } from '../data/shelves';

export function GenerateBooks(setBooks, countOfBooks) {
  const booksPerShelf = countOfBooks; // Кількість місць на одній полиці
  const positions = [0, 1, 2]; // 0 = рівно, 1 = нахил вправо, 2 = нахил вліво
  
  const generatedBooks = [];
  
  shelves.forEach((shelf, shelfIndex) => {
    // Створюємо масив вільних місць для цієї полиці
    const freeSlots = Array.from({ length: booksPerShelf }, (_, i) => i);
    
    // Для кожної книги на полиці
    shelf.books.forEach((book, bookIndex) => {
      // Вибираємо випадкове вільне місце
      const randomSlotIndex = Math.floor(Math.random() * freeSlots.length);
      const slot = freeSlots[randomSlotIndex];
      
      // Видаляємо це місце з вільних
      freeSlots.splice(randomSlotIndex, 1);
      
      // Розраховуємо позицію у відсотках
      const position = (slot / booksPerShelf) * 100;
      
      // Вибираємо випадкову позицію (0, 1, 2)
      const positionType = positions[Math.floor(Math.random() * positions.length)];
      
      // Визначаємо кут нахилу в залежності від типу позиції
      let rotation = 0;
      if (positionType === 1) rotation = 5; // Нахил вправо
      if (positionType === 2) rotation = -5; // Нахил вліво
      
      generatedBooks.push({
        id: `${shelfIndex}-${bookIndex}`,
        title: book.title,
        genre: shelf.genre,
        shelf: shelfIndex,
        rotation,
        position,
        positionType,
        slot
      });
    });
  });
  
  setBooks(generatedBooks);
}
