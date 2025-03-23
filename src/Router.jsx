import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import WeatherDashboard from "./components/WeatherDashboard";
import ErrorDisplay from "./components/common/ErrorDisplay";
import LoadingSpinner from "./components/common/LoadingSpinner";

const Router = () => {
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(
          `Location access denied. Please enable location services. ${err}`
        );
        setLoading(false);
      }
    );
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorDisplay message={error} />
              ) : (
                <WeatherDashboard
                  latitude={coords.latitude}
                  longitude={coords.longitude}
                />
              )
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
