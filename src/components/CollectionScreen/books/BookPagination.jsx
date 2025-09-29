export default function BookPagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisiblePages; i++) pages.push(i);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-3 courier-prime-bold mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-5 py-3 border-2 border-stone-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 transition-all duration-200"
      >
        ← Попередня
      </button>
      
      <div className="flex gap-2">
        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
              currentPage === pageNum
                ? 'bg-stone-600 text-white border-stone-700 shadow-lg'
                : 'border-stone-300 hover:bg-stone-100 hover:border-stone-500'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-5 py-3 border-2 border-stone-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 transition-all duration-200"
      >
        Наступна →
      </button>
    </div>
  );
}