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
import axios from "axios";
import { Loader } from "@googlemaps/js-api-loader";
import LoadingSpinner from "./common/LoadingSpinner";
import ErrorDisplay from "./common/ErrorDisplay";

function WeatherDashboard({ latitude, longitude }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    let isMounted = true;

    if (!latitude || !longitude) return;

    const fetchLocationData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching location data...");
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const response = await axios.get(
          `${baseUrl}/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`
        );

        if (response.data.results?.length > 0) {
          const result = response.data.results[0];
          const city = result.address_components.find((comp) =>
            comp.types.includes("locality")
          );
          const country = result.address_components.find((comp) =>
            comp.types.includes("country")
          );

          if (isMounted) {
            setLocation(
              city
                ? `${city.long_name}, ${country.short_name}`
                : country.long_name
            );
            setAddress(result.formatted_address);
          }
        } else {
          if (isMounted) setLocation("Location not found");
        }
      } catch (err) {
        console.error("Error fetching location data:", err);
        if (isMounted) setError("Failed to fetch location data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLocationData();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  useEffect(() => {
    if (!latitude || !longitude || !mapRef.current || mapInstance.current)
      return;

    console.log("Initializing Google Maps...");

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader
      .load()
      .then(() => {
        if (!window.google || !mapRef.current) {
          console.error("Google Maps failed to load");
          setError("Google Maps failed to load.");
          return;
        }

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 12,
          disableDefaultUI: false,
        });

        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstance.current,
        });
      })
      .catch((err) => {
        console.error("Error loading Google Maps:", err);
        setError("Failed to load Google Maps.");
      });

    return () => {
      mapInstance.current = null;
    };
  }, [latitude, longitude]);

  return (
    <motion.div className="flex flex-col items-center p-4 w-full">
      {loading && <LoadingSpinner />}
      {error && <ErrorDisplay message={error} />}

      {!loading && !error && location && (
        <div className="bg-gradient-to-br from-indigo-800 to-purple-800 rounded-xl shadow-lg p-6 text-white w-full max-w-lg">
          <div className="mb-6 text-center">
            <MdLocationOn className="text-4xl text-blue-300 inline" />
            <h2 className="text-3xl font-semibold ml-2 inline">{location}</h2>
          </div>

          {address && (
            <div className="mb-6">
              <div className="flex items-center justify-center mb-2">
                <MdPlace className="text-4xl text-blue-300" />
                <p className="text-lg ml-2">{address}</p>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigator.clipboard.writeText(address)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full flex items-center"
                >
                  <MdContentCopy className="mr-2" /> Copy
                </button>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}?lat=${latitude}&lng=${longitude}`
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full flex items-center"
                >
                  <MdShare className="mr-2" /> Share
                </button>
              </div>
            </div>
          )}

          <div
            ref={mapRef}
            className="h-72 w-full bg-gray-700 rounded-lg overflow-hidden"
          />

          <div className="flex justify-center mt-6">
            <button
              onClick={() =>
                mapRef.current?.requestFullscreen &&
                mapRef.current.requestFullscreen()
              }
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full flex items-center"
            >
              <MdZoomOutMap className="mr-2" /> Full Screen
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default WeatherDashboard;
