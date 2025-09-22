import { useState } from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./pages/HomeScreen";
import BookScreen from "./pages/BookScreen";
import AddNewBookForm from "./services/AddNewBookForm";
import ParallaxDecorations from "./components/ParallaxDecorations";

export default function App() {

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
