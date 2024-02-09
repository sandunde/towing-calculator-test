import React, { useState } from "react";
import { Form } from "react-bootstrap";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const LocationSearchInput = ({ onSelect }) => {
  const [address, setAddress] = useState("");

  const handleSelect = async (selected) => {
    const results = await geocodeByAddress(selected);
    const latLng = await getLatLng(results[0]);

    setAddress(selected);
    onSelect({ address: selected, latLng });
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={(value) => setAddress(value)}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <Form.Control
            {...getInputProps({
              placeholder: "Enter address...",
              className: "location-search-input",
            })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const style = {
                backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                color: "#000",
                maxWidth: "300px",
              };
              return (
                <div
                  key={suggestion.placeId}
                  {...getSuggestionItemProps(suggestion, {
                    style,
                  })}
                >
                  {suggestion.description}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

const MyComponent = () => {
  const [destinationLatLng, setDestinationLatLng] = useState(null);

  const handleSelect = ({ address, latLng }) => {
    console.log("Selected Address:", address);
    console.log("Latitude and Longitude:", latLng);
    console.log(latLng.lat);

    // Save destination latitude and longitude to state and local storage
    setDestinationLatLng(latLng);
    sessionStorage.setItem("currentLatitude", latLng.lat);
    sessionStorage.setItem("currentLongitude", latLng.lng);
    sessionStorage.setItem("currentLocation", address);
  };

  return (
    <div>
      <Form.Label>Your Pickup Location</Form.Label>
      <LocationSearchInput onSelect={handleSelect} />
    </div>
  );
};

export default MyComponent;
