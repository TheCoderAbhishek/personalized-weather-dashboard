// src/components/WeatherDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  MdLocationOn,
  MdPlace,
  MdZoomOutMap,
  MdContentCopy,
  MdShare,
} from "react-icons/md";
import LoadingSpinner from "./common/LoadingSpinner";
import ErrorDisplay from "./common/ErrorDisplay";
import axios from "axios";
import { Loader } from "@googlemaps/js-api-loader";

function WeatherDashboard({ latitude, longitude }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [addressComponents, setAddressComponents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      setLoading(true);
      setError(null);
      try {
        const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        const locationResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`
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
          setAddress(result.formatted_address);
          setAddressComponents(result.address_components);
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
      setLoading(true);
      setError(null);
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: "weekly",
        libraries: ["places"],
      });

      loader
        .load()
        .then(() => {
          const google = window.google;
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: latitude, lng: longitude },
            zoom: 12,
            mapTypeId: "roadmap",
            mapTypeControl: true,
            zoomControl: true,
          });

          new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: mapInstance,
          });
          setMap(mapInstance);
        })
        .catch((err) => {
          console.error("Map Load Error:", err);
          setError("Failed to load Google Maps.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [latitude, longitude]);

  const handleFullScreen = () => {
    if (map) {
      const mapElement = map.getDiv();
      if (mapElement.requestFullscreen) {
        mapElement.requestFullscreen();
      } else if (mapElement.mozRequestFullScreen) {
        mapElement.mozRequestFullScreen();
      } else if (mapElement.webkitRequestFullscreen) {
        mapElement.webkitRequestFullscreen();
      } else if (mapElement.msRequestFullscreen) {
        mapElement.msRequestFullscreen();
      }
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleShareLocation = () => {
    const shareUrl = `${window.location.origin}?lat=${latitude}&lng=${longitude}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Location URL copied to clipboard!");
  };

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
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-md p-6 text-white w-full max-w-lg">
          <div className="mb-4">
            <div className="flex items-center justify-center mb-2">
              <MdLocationOn className="text-3xl mr-2 text-blue-500" />
              <h2 className="text-2xl font-semibold">{location}</h2>
            </div>
          </div>
          {address && (
            <div className="mb-4">
              <div className="flex items-center justify-center mb-2">
                <MdPlace className="text-3xl mr-2 text-blue-500" />
                <p className="text-xl ml-2">{address}</p>
              </div>
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => handleCopyToClipboard(address)}
                  className="mr-2 p-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  <MdContentCopy />
                </button>
                <button
                  onClick={handleShareLocation}
                  className="p-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  <MdShare />
                </button>
              </div>
            </div>
          )}
          <div
            ref={mapRef}
            style={{ height: "300px", width: "100%", marginBottom: "1rem" }}
          ></div>
          <div className="flex justify-center">
            <button
              onClick={handleFullScreen}
              className="flex items-center p-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              <MdZoomOutMap className="mr-2" /> Full Screen
            </button>
          </div>
          {addressComponents && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                Address Components:
              </h3>
              <ul className="list-disc list-inside">
                {addressComponents.map((component, index) => (
                  <li key={index}>
                    {component.long_name} ({component.types.join(", ")})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default WeatherDashboard;
