import { shelves } from '../data/shelves';

export function GenerateBooks(setBooks) {
    const generatedBooks = [];
    
    shelves.forEach((shelf, shelfIndex) => {
      shelf.books.forEach((book, bookIndex) => {
        const rotation = Math.floor(Math.random() * 15) - 7; // Випадковий нахил від -7 до 7 градусів
        const position = 10 + Math.floor(Math.random() * 70); // Випадкове положення на полиці
        // const isLying = Math.random() > 0.8; // 20% ймовірність, що книга лежить
        
        generatedBooks.push({
          id: `${shelfIndex}-${bookIndex}`,
          title: book.title,
          genre: shelf.genre,
          shelf: shelfIndex,
          rotation,
          position,
          // isLying
        });
      });
    });
    
    setBooks(generatedBooks);
}
