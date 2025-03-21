// src/components/WeatherDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { MdLocationOn, MdPlace } from "react-icons/md";
import LoadingSpinner from "./common/LoadingSpinner";
import ErrorDisplay from "./common/ErrorDisplay";
import axios from "axios";
import { Loader } from "@googlemaps/js-api-loader";

function WeatherDashboard({ latitude, longitude }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        const locationResponse = await axios.get(
          `${baseUrl}/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`
        );

        if (
          locationResponse.data.results &&
          locationResponse.data.results.length > 0
        ) {
          const result = locationResponse.data.results[0];
          const city = result.address_components.find((component) =>
            component.types.includes("locality")
          );
          const country = result.address_components.find((component) =>
            component.types.includes("country")
          );
          let formattedLocation = "";
          if (city && country) {
            formattedLocation = `${city.long_name}, ${country.short_name}`;
          } else if (country) {
            formattedLocation = country.long_name;
          } else {
            formattedLocation = "Location not found";
          }
          setLocation(formattedLocation);
          setAddress(result.formatted_address); // Store full address
        } else {
          setLocation("Location not found");
        }
      } catch (err) {
        console.error("Geocoding Error:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchLocationData();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      setLoading(true); // Set loading to true when map starts loading
      setError(null);
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: "weekly",
      });

      loader
        .load()
        .then(() => {
          const google = window.google;
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: latitude, lng: longitude },
            zoom: 12,
          });

          new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
          });
        })
        .catch((err) => {
          console.error("Map Load Error:", err);
          setError("Failed to load Google Maps.");
        })
        .finally(() => {
          setLoading(false); // Set loading to false when map loading is complete
        });
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
      className="flex flex-col items-center p-4"
    >
      {loading && <LoadingSpinner />}
      {error && <ErrorDisplay message={error} />}
      {location && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-md p-6 text-white w-full max-w-md">
          <div className="flex items-center justify-center mb-4">
            <MdLocationOn className="text-3xl mr-2 text-blue-500" />
            <h2 className="text-2xl font-semibold">{location}</h2>
          </div>
          {address && (
            <div className="flex items-center justify-center mb-4">
              <MdPlace className="text-3xl mr-2 text-blue-500" />
              <p className="text-xl ml-2">{address}</p>
            </div>
          )}
          <div
            ref={mapRef}
            style={{ height: "300px", width: "100%", marginBottom: "1rem" }}
          ></div>
        </div>
      )}
    </motion.div>
  );
}

export default WeatherDashboard;
