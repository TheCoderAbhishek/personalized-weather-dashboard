// src/components/WeatherDashboard.jsx
import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { MdLocationOn } from "react-icons/md";
import LoadingSpinner from "./common/LoadingSpinner";
import ErrorDisplay from "./common/ErrorDisplay";
import axios from "axios";

function WeatherDashboard({ latitude, longitude }) {
  console.log("WeatherDashboard mounted"); // Component mount check
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("WeatherDashboard useEffect triggered");
    console.log("Latitude:", latitude, "Longitude:", longitude);

    const fetchLocationData = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = "https://maps.googleapis.com/maps/api"; // Correct Base URL
        const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        console.log(
          "URL: ",
          `${baseUrl}/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`
        );

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`
        );

        console.log("API Response:", response.data);

        if (response.data.results && response.data.results.length > 0) {
          const city = response.data.results[0].address_components.find(
            (component) => component.types.includes("locality")
          );
          const country = response.data.results[0].address_components.find(
            (component) => component.types.includes("country")
          );
          if (city && country) {
            setLocation(`${city.long_name}, ${country.short_name}`);
          } else if (country) {
            setLocation(country.long_name);
          } else {
            setLocation("Location not found");
          }
        } else {
          setLocation("Location not found");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      console.log("fetchLocationData will be called");
      fetchLocationData();
    } else {
      console.log("Latitude or longitude is invalid");
    }
  }, [latitude, longitude]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-center items-center p-4"
    >
      {loading && <LoadingSpinner />}
      {error && <ErrorDisplay message={error} />}
      {location && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-md p-6 text-white w-full max-w-md">
          <div className="flex items-center justify-center mb-4">
            <MdLocationOn className="text-3xl mr-2" />
            <h2 className="text-2xl font-semibold">Location</h2>
          </div>
          <p className="text-lg text-center">{location}</p>
        </div>
      )}
    </motion.div>
  );
}

export default WeatherDashboard;
