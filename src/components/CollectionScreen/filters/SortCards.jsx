import cardTexture from '/textures/card-texture.png';
import cardTextureBack from '/textures/card-texture-back.png';

export default function SortButtons({
  titleSort,
  authorSort,
  onTitleSortToggle,
  onAuthorSortToggle
}) {
  return (
    <div className="flex flex-col gap-4 justify-center mb-8">
      <SortButton
        label="Назва"
        sortState={titleSort}
        onToggle={onTitleSortToggle}
      />
      <SortButton
        label="Автор"
        sortState={authorSort}
        onToggle={onAuthorSortToggle}
      />
    </div>
  );
}

function SortButton({ label, sortState, onToggle }) {
  const getDisplayText = () => {
    if (sortState === 'none') return '';
    return sortState === 'asc' ? 'А ⇓ Я' : 'Я ⇓ А';
  };

  return (
    <button
      onClick={onToggle}
      className="px-4 py-2 cursor-pointer transition-all duration-200 courier-prime-bold"
    >
      <div className="text-center flex flex-col items-center">
        <div className="text-lg font-bold">{label}</div>
        <div 
          className={`w-20 h-30 flex justify-center items-center transition-transform duration-500 ${
            sortState === 'desc' ? 'rotate-360' : ''
          }`}
          style={{
            backgroundImage: `url(${sortState === 'none' ? cardTextureBack : cardTexture})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center', 
          }}
        >
          <div 
            className="text-stone-600 text-xl font-semibold"
            style={{ 
              writingMode: 'vertical-rl',
              textOrientation: 'upright'
            }}
          >
            {getDisplayText()}
          </div>
        </div>
      </div>
    </button>
  );
}