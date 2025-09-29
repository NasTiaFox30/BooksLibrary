export default function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-stone-600 mx-auto mb-6"></div>
        <div className="courier-prime-bold text-stone-800 text-xl">Завантаження колекції...</div>
      </div>
    </div>
  );
}