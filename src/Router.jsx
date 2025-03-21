// src/Router.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeatherDashboard from "./components/WeatherDashboard";
import CurrentWeather from "./components/dashboard/CurrentWeather";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherDashboard />} />
        <Route path="/current-weather" element={<CurrentWeather />} />
        {/* Add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default AppRouter;
