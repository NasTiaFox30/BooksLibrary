import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.config';

// Get all books
export const getBooks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    const books = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return books;
  } catch (error) {
    console.error("Помилка завантаження книг:", error);
    return [];
  }
};

// Get all genres
export const getGenres = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "genres"));
    const genres = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return genres;
  } catch (error) {
    console.error("Помилка завантаження жанрів:", error);
    return [];
  }
};

// Add a New genre
export const addGenre = async (genreData) => {
  try {
    const docRef = await addDoc(collection(db, "genres"), genreData);
    return { id: docRef.id, ...genreData };
  }
  catch (error) {
    console.error("Помилка при додаванні жанру:", error);
    throw new Error("Не вдалося додати жанр. Спробуйте ще раз.");
  }
};