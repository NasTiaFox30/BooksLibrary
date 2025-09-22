import { useState } from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./pages/HomeScreen";
import BookScreen from "./pages/BookScreen";
import AddNewBookForm from "./services/AddNewBookForm";
import ParallaxDecorations from "./components/ParallaxDecorations";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [titleClicked, setTitleClicked] = useState(false);

  const handleGoHome = () => {
    setCurrentScreen('home');
    setSelectedBook(null);
    setClickCount(0);
    setTitleClicked(false);
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
      setCurrentScreen('add-book');
      setClickCount(0);
      setTitleClicked(false);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'book':
        return <BookScreen book={selectedBook} onGoBack={handleGoHome} />;
      case 'add-book':
        return <AddNewBookForm onGoBack={handleGoHome} />;
      default:
        return (
          <HomeScreen 
            onOpenBook={handleOpenBook} 
            onTitleClick={handleTitleClick}
            onCatClick={handleCatClick}
          />
        );
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url(/textures/bg.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center'
      }}>
      <ParallaxDecorations/>
      <Header/>

      <HomeScreen />

      {/* <AddNewBookForm /> */}
      <Footer/>
      
    </div>
  );
}
