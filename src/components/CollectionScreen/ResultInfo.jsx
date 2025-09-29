import paperPeaceTexture from '/textures/paper-peace.png';
import { Tape } from '../Decor.jsx';

export default function ResultsInfo({ filteredBooks, currentPage, totalPages }) {
  return (
    <div className="relative w-100 h-20 mb-6">
      <div className="courier-prime h-35 text-gray-800 text-lg p-4 text-center"
        style={{
          backgroundImage: `url(${paperPeaceTexture})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top',
        }}
      >
        Знайдено книг: <span className="font-bold">{filteredBooks.length}</span> | 
        Сторінка: <span className="font-bold">{currentPage}</span> з <span className="font-bold">{totalPages}</span>
      </div>
      <Tape degree={35} size={60} top={-20} right={-10} />
    </div>
  );
}