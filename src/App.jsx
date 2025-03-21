// src/App.jsx
import React, { useState, useEffect } from "react";
import WeatherDashboard from "./components/WeatherDashboard";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            console.error("App.js: Geolocation error:", error);
            setLocationError(error.message);
          }
        );
      } else {
        console.error("App.js: Geolocation is not supported by this browser.");
        setLocationError("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  });

  useEffect(() => {
    console.log("App.js: Latitude:", latitude, "Longitude:", longitude);
  }, [latitude, longitude]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto flex-grow p-4">
        {locationError && <p>Error: {locationError}</p>}
        {latitude && longitude ? (
          <WeatherDashboard latitude={latitude} longitude={longitude} />
        ) : (
          <p>Getting your location...</p>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
