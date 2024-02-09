import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import './locationDisplay.css';

const LocationDisplay = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Reverse geocoding using OpenCage Geocoding API
          const apiKey = "b4246ae60c9440c6bb4ec276e3e3fb0b";
          const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

          try {
            const response = await axios.get(apiUrl);
            const address = response.data.results[0].formatted;

            // Set the location in state
            setLocation(address);

            // Save latitude, longitude, and location to session storage
            sessionStorage.setItem("currentLatitude", latitude);
            sessionStorage.setItem("currentLongitude", longitude);
            sessionStorage.setItem("currentLocation", address);
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="display-container">
      <Form.Group controlId="formCurrentLocation">
        <Form.Label>Your Current Location:</Form.Label>
        <Form.Control
          type="text"
          value={location || "Fetching your location..."}
          readOnly
          className="form-current-location"
        />
      </Form.Group>
    </div>
  );
};

export default LocationDisplay;
