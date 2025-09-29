export default function Header({ currentScreen, onNavigate, onTitleClick , isMobile}) {
  const handleLogoClick = () => {
    if (currentScreen !== 'home') {
      onNavigate('home');
    } else {
      // on Home page
      onTitleClick();
    }
  };

  return (
    <header className={`${isMobile ? 'px-4 py-3' : 'px-6 py-4'} text-center`}>
      <h1 
        className="text-5xl md:text-6xl font-bold pb-4 inline-block cursor-pointer select-none hover:opacity-80 transition-opacity active:scale-95"
        onClick={handleLogoClick}
      >Books library
      </h1>
    </header>
  );
}