import Shelf from './Shelf';
import { shelves } from '../data/shelves';

export default function Bookshelf({ books }) {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Верх шафи */}
      <div className="h-10 bg-amber-900 rounded-t-lg"></div>
      {/* Контейнер шафи */}
      <div className="bg-amber-800 rounded-lg shadow-2xl p-6 md:p-8 relative">
        
        {/* Полиці з книгами */}
        {shelves.map((shelf, shelfIndex) => (
          <Shelf 
            key={shelfIndex} 
            shelf={shelf} 
            shelfIndex={shelfIndex} 
            books={books} 
          />
        ))}
        
        {/* Ніжки шафи */}
        <div className="flex justify-between mt-4">
          <div className="w-12 h-16 bg-amber-900 rounded-t-md"></div>
          <div className="w-12 h-16 bg-amber-900 rounded-t-md"></div>
        </div>
      </div>
    </div>
  );
}