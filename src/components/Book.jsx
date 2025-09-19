export default function Book({ book }) {
  return (
    <div
      className={"absolute bottom-2 h-24 w-8 border border-amber-900 cursor-pointer transition-transform hover:scale-105 flex items-center justify-center overflow-hidden shadow-lg shadow-amber-900/30"}
      style={{
        left: `${book.position}%`,
        transform: `rotate(${book.rotation}deg)`,
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`
      }}
      title={book.title}
    >
      <div className="flex flex-col items-center">
        <span className="text-xs font-bold text-white whitespace-nowrap rotate-90 transform origin-center mt-8">
          {book.title}
        </span>
        <div className="h-4 w-full bg-black opacity-20 absolute bottom-0"></div>
      </div>
    </div>
  );
}