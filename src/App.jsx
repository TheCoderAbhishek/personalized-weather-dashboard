// src/App.jsx
import React, { useState, useEffect } from "react";
import WeatherDashboard from "./components/WeatherDashboard";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setLoading(false); // Location fetched, stop loading
          },
          (error) => {
            console.error("App.js: Geolocation error:", error);
            setLocationError(error.message);
            setLoading(false); // Error occurred, stop loading
          }
        );
      } else {
        console.error("App.js: Geolocation is not supported by this browser.");
        setLocationError("Geolocation is not supported by this browser.");
        setLoading(false); // Geolocation not supported, stop loading
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    console.log("App.js: Latitude:", latitude, "Longitude:", longitude);
  }, [latitude, longitude]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto flex-grow p-4">
        {locationError && <p>Error: {locationError}</p>}
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
