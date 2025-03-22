// src/App.jsx
import React, { useState, useEffect } from "react";
import WeatherDashboard from "./components/WeatherDashboard";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Prevents unnecessary updates in Strict Mode

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted) {
            console.log("Geolocation success:", position.coords);
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          if (isMounted) {
            setLocationError(error.message);
            setLoading(false);
          }
        }
      );
    } else {
      console.error("Geolocation is not supported.");
      if (isMounted) {
        setLocationError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto flex-grow p-4">
        {locationError && (
          <p className="text-red-500">Error: {locationError}</p>
        )}
        {loading && !locationError && <p>Getting your location...</p>}
        {latitude && longitude && !locationError && !loading ? (
          <WeatherDashboard latitude={latitude} longitude={longitude} />
        ) : (
          !loading &&
          !locationError &&
          !latitude &&
          !longitude && <p>Location not available.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
