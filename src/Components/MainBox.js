import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import LocationDisplay from "./LocationDisplay";
import LocationSearch from "./LocationSearch";
import CurrentLocationType from "./CurrentLocationType";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ServiceSelector from "./ServiceSelector";


const App = () => {
  const [typeLocation, setTypeLocation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
  });
  const [isEmpty, setIsEmpty] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    setShowContactForm(false);
  };

  const handleShowModal = () => {
    if (
      formData.contact === "" ||
      formData.email === "" ||
      formData.name === ""
    ) {
      setIsEmpty(true);
    } else {
      setShowContactForm(false);
      setShowModal(true);
      setIsEmpty(false);
      const {name, email, contact} = formData;
      const options = {
        method: 'POST',
        Headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          name, email, contact
        })
      }
      const res = fetch('https://discount-auto-towing-default-rtdb.firebaseio.com/', options)
      if(res){
        console.log("message sent");
      }else{
        console.log("Error occurred");
      }
    }
  };

  const handleShowContactForm = () => setShowContactForm(true);

  const calculatePrice = () => {
    // Check if required input fields are filled
    const currentLocation = sessionStorage.getItem("currentLocation");
    const destination = sessionStorage.getItem("destination");
    const selectedService = sessionStorage.getItem("selectedService");
    const totalPrice = sessionStorage.getItem("totalPrice");

    if (
      currentLocation &&
      destination &&
      selectedService &&
      totalPrice !== null
    ) {
      // Proceed with the calculation
      const additionalCost =
        selectedService === "towing" ? calculateTowingCost() : 0;
      const finalPrice = parseFloat(totalPrice) + additionalCost;

      // Show contact form modal
      handleShowContactForm();
    } else {
      alert("Please fill in all required fields before calculating the price.");
    }
  };

  const calculateTowingCost = () => {
    // Retrieve coordinates from session storage
    const currentLatitude = parseFloat(
      sessionStorage.getItem("currentLatitude")
    );
    const currentLongitude = parseFloat(
      sessionStorage.getItem("currentLongitude")
    );
    const destinationLatitude = parseFloat(
      sessionStorage.getItem("destinationLatitude")
    );
    const destinationLongitude = parseFloat(
      sessionStorage.getItem("destinationLongitude")
    );

    // Check if coordinates are valid numbers
    if (
      isNaN(currentLatitude) ||
      isNaN(currentLongitude) ||
      isNaN(destinationLatitude) ||
      isNaN(destinationLongitude)
    ) {
      alert(
        "Invalid coordinates. Please make sure both current and destination coordinates are available."
      );
      return 0;
    }

    // Calculate distance using Haversine formula
    const distance = calculateHaversineDistance(
      currentLatitude,
      currentLongitude,
      destinationLatitude,
      destinationLongitude
    );

    // Calculate additional cost for towing service ($6 per kilometer)
    const towingCost = distance * 6;
    return towingCost;
  };

  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const changeToType = () => {
    setTypeLocation(!typeLocation);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="App">
      <div className="main-box">
        {typeLocation ? <CurrentLocationType /> : <LocationDisplay />}
        <LocationSearch />
        <ServiceSelector />
      </div>
      <div className="button-box">
        <Button variant="outline-secondary" onClick={changeToType}>
          {typeLocation ? "Use Current Location" : "Change Current Location"}
        </Button>
        <Button variant="outline-secondary" onClick={calculatePrice}>
          Calculate Price
        </Button>
      </div>
      <p className="estimate-text">
        <span className="span-text">*</span>This is an estimation. For more
        accurate information, please contact us.
      </p>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Price Calculation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            From: {sessionStorage.getItem("currentLocation")}
            <br />
            To: {sessionStorage.getItem("destination")}
            <br />
            Service: {sessionStorage.getItem("selectedService")}
            <br />
            Total Price: $
            {(
              parseFloat(sessionStorage.getItem("totalPrice")) +
              (sessionStorage.getItem("selectedService") === "towing"
                ? calculateTowingCost()
                : 0)
            ).toFixed(2)}{" "}
            + Tax
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showContactForm} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form method="POST">
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formContact">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your contact number"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
          {isEmpty ? (
            <p style={{ color: "red", marginTop: 10 }}>
              Please fill out all the fields
            </p>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleShowModal}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
