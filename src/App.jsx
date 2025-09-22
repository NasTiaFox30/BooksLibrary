import Header from "./components/Header"
import Footer from "./components/Footer";
import HomeScreen from "./pages/HomeScreen";
import AddNewBookForm from "./services/AddNewBookForm";
import ParallaxDecorations from "./components/ParallaxDecorations";

export default function App() {

  return (
    <div
      style={{
        backgroundImage: 'url(/textures/bg.png)',
        backgroundSize: 'cover',
        backgroundSize: '100%',
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
