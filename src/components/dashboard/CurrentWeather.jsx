// src/components/dashboard/CurrentWeather.jsx
import React from "react";
import WeatherIcon from "../../assets/icons/weatherIcon.png";

function CurrentWeather({ weatherData, loading, error }) {
  if (loading) {
    return <p className="text-center mt-4">Loading current weather...</p>;
  }

  if (error) {
    return <p className="text-center mt-4 text-red-500">Error: {error}</p>;
  }

  if (!weatherData) {
    return null;
  }

  const { temperature, humidity, windSpeed, condition, icon } = weatherData;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Current Weather
      </h2>
      <div className="flex items-center justify-center mb-4">
        <WeatherIcon icon={icon} condition={condition} className="text-4xl" />
        <span className="text-4xl ml-2">{temperature}°C</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Condition: {condition}</p>
        </div>
        <div>
          <p className="font-medium">Humidity: {humidity}%</p>
        </div>
        <div>
          <p className="font-medium">Wind Speed: {windSpeed} m/s</p>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;
