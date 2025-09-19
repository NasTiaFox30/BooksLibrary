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
  const querySnapshot = await getDocs(collection(db, 'books'));
  const books = [];
  querySnapshot.forEach((doc) => {
    books.push({ id: doc.id, ...doc.data() });
  });
  return books;
};

// Get uniq genres
export const getGenres = async () => {
  const books = await getBooks();
  const genres = [...new Set(books.map(book => book.genre))];
  return genres;
};