import { getBooks, getGenres } from '../services/booksService';

export const GenerateBooks = async (booksCount) => {
  const booksPerShelf = booksCount;
  const positions = [0, 1, 2];
  
  try {
    const [allBooks, genres] = await Promise.all([
      getBooks(), getGenres()
    ]);

    const generatedBooks = [];

    genres.forEach((genre, shelfIndex) => {
      const genreBooks = allBooks.filter(book => 
        Array.isArray(book.genres) && book.genres.includes(genre.id)
      );

      const booksToShow = Math.min(genreBooks.length, booksPerShelf);
      const selectedBooks = genreBooks.slice(0, booksToShow);

      const freeSlots = Array.from({ length: booksPerShelf }, (_, i) => i);

      selectedBooks.forEach((book, bookIndex) => {
        if (freeSlots.length === 0) return;

        const randomSlotIndex = Math.floor(Math.random() * freeSlots.length);
        const slot = freeSlots[randomSlotIndex];
        freeSlots.splice(randomSlotIndex, 1);

        const position = (slot / booksPerShelf) * 100;
        const positionType = positions[Math.floor(Math.random() * positions.length)];
        
        let rotation = 0;
        if (positionType === 1) rotation = 5;
        if (positionType === 2) rotation = -5;

        generatedBooks.push({
          id: book.id || `${shelfIndex}-${bookIndex}`,
          title: book.title,
          author: book.author,
          year: book.year,
          description: book.description,
          imagePath: book.imagePath,
          genres: book.genres,
          pages: book.pages,
          language: book.language,
          publisher: book.publisher,
          characters: book.characters || [],
          opinion: book.opinion, 
          colorHue: book.colorHue,
          size: book.size,
          // Shelf info
          shelf: shelfIndex,
          rotation,
          position,
          positionType,
          slot,
          colorHue: book.colorHue || Math.random() * 360
        });
      });
    });

    return { books: generatedBooks, genres };
    
  } catch (error) {
    console.error('Помилка завантаження книг:', error);
    return { books: [], genres: [] };
  }
};