import TypewriterSearch from './TypewriterSearch';

export default function SearchSection({ searchTerm, onSearchChange, isMobile }) {
  return (
    <div className="flex-1 md:w-1/2 flex justify-center mb-8">
        <TypewriterSearch
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Пошук за назвою, автором, описом..."
            isMobile={isMobile}
        />
    </div>
);
}