import { useState } from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./pages/HomeScreen";
import BookScreen from "./pages/BookScreen";
import AddNewBookForm from "./services/AddNewBookForm";
import AuthScreen from "./pages/AuthScreen";
import ParallaxDecorations from "./components/ParallaxDecorations";
import LightOverlay from "./components/LightOverlay";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [titleClicked, setTitleClicked] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleGoHome = () => {
    setCurrentScreen('home');
    setSelectedBook(null);
    setClickCount(0);
    setTitleClicked(false);
    setCurrentUser(null);
  };

  // Book
  const handleOpenBook = (book) => {
    setSelectedBook(book);
    setCurrentScreen('book');
  };

  // Cat
  const handleTitleClick = () => {
    setTitleClicked(true);
    setClickCount(0);
    setLastClickTime(Date.now());
  };

  const handleCatClick = () => {
    if (!titleClicked) return;
    
    const currentTime = Date.now();
    
    if (currentTime - lastClickTime > 3000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    
    setLastClickTime(currentTime);

    if (titleClicked && clickCount >= 2 && currentTime - lastClickTime < 3000) {
      setCurrentScreen('auth');
      setClickCount(0);
      setTitleClicked(false);
    }
  };

  // Authenticate
  const handleAuthenticate = (user) => {
    setCurrentUser(user);
    setCurrentScreen('add-book');
  };

  // Turn lights ON/OFF
  const handleLampClick = () => {
    setIsLightOn(prev => !prev);
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'book':
        return <BookScreen book={selectedBook} onGoBack={handleGoHome} />;
      case 'add-book':
        if (!currentUser) {
          return <AuthScreen onAuthenticate={handleAuthenticate}/>;
        }
        return <AddNewBookForm onSuccess={handleGoHome} currentUser={currentUser} />;
      case 'auth':
        return <AuthScreen onAuthenticate={handleAuthenticate}/>;
      default:
        return (
          <HomeScreen 
            onOpenBook={handleOpenBook} 
            onTitleClick={handleTitleClick}
            onCatClick={handleCatClick}
            onLampClick={handleLampClick}
            isLightOn={isLightOn}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen"> 
      <div
        style={{
          backgroundImage: 'url(/textures/bg.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center'
        }}>
        <ParallaxDecorations/>
        <Header
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          onTitleClick={handleTitleClick}
          currentUser={currentUser}
          onLogout={() => setCurrentUser(null)}
        />
        
        {renderScreen()}
        
        <Footer />
      </div>

      <LightOverlay isLightOn={isLightOn} currentScreen={currentScreen} />
    </div>
  );
}
