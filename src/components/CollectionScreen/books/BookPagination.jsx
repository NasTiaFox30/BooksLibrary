export default function BookPagination({ currentPage, totalPages, onPageChange, isMobile }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 2) {
      for (let i = 1; i <= maxVisiblePages; i++) pages.push(i);
    } else if (currentPage >= totalPages - 1) {
      for (let i = totalPages - (maxVisiblePages - 1); i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className={`flex justify-center items-center gap-2 md:gap-3 courier-prime-bold mb-6 md:mb-8 ${
      isMobile ? 'flex-col space-y-3' : ''
    }`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`border-2 border-stone-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 transition-all duration-200 ${
          isMobile ? 'px-4 py-2 text-sm w-full' : 'px-5 py-3'
        }`}
      >
        ← Попередня
      </button>
      
      <div className="flex gap-1 md:gap-2">
        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`border-2 transition-all duration-200 ${
              isMobile 
                ? 'w-8 h-8 text-sm rounded-md' 
                : 'w-12 h-12 rounded-lg'
            } ${
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
        className={`border-2 border-stone-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 transition-all duration-200 ${
          isMobile ? 'px-4 py-2 text-sm w-full' : 'px-5 py-3'
        }`}
      >
        Наступна →
      </button>
    </div>
  );
}