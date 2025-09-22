import Header from "./components/Header"
import Footer from "./components/Footer";
import HomeScreen from "./pages/HomeScreen";

export default function App() {

  return (
    <div
    style={{
      backgroundImage: 'url(/textures/bg.png)',
      backgroundSize: 'cover',
      backgroundSize: '100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }}>
      <Header/>

      <HomeScreen />
      
      <Footer/>
      
    </div>
  );
}
