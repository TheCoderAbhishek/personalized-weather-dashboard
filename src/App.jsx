import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          {/* <LocationSearch />
        <MapDisplay />
        <CurrentWeather />
        <Forecast />
        <LoadingSpinner />
        <ErrorDisplay /> */}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
