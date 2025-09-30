import cardTexture from '/textures/card-texture.png';
import cardTextureBack from '/textures/card-texture-back.png';

export default function SortButtons({
  titleSort,
  authorSort,
  onTitleSortToggle,
  onAuthorSortToggle,
  isMobile
}) {
  return (
    <div className={`${isMobile ? "flex gap-3 justify-center mb-4 w-full" : "flex flex-col gap-4 justify-center mb-8"} `} >
      <SortButton
        label="Назва"
        sortState={titleSort}
        onToggle={onTitleSortToggle}
        isMobile={isMobile}
      />
      <SortButton
        label="Автор"
        sortState={authorSort}
        onToggle={onAuthorSortToggle}
        isMobile={isMobile}
      />
    </div>
  );
}

function SortButton({ label, sortState, onToggle, isMobile }) {
  const getDisplayText = () => {
    if (sortState === 'none') return '';
    return sortState === 'asc' ? 'А ⇓ Я' : 'Я ⇓ А';
  };

  return (
    <button
      onClick={onToggle}
      className="px-4 py-2 cursor-pointer hover:scale-95 transition-all duration-200 courier-prime-bold"
    >
      <div className="text-center flex flex-col items-center">
        <div className="text-lg font-bold">{label}</div>
        <div 
          className={`${isMobile ? "w-15 h-25" : "w-20 h-30"} flex justify-center items-center transition-transform duration-500 ${
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
            className={`text-stone-600 ${isMobile ? "text-md" : "text-xl"} font-semibold`}
            style={{ 
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
              letterSpacing: isMobile ? "-6px" : "-4px",
            }}
          >
            {getDisplayText()}
          </div>
        </div>
      </div>
    </button>
  );
}